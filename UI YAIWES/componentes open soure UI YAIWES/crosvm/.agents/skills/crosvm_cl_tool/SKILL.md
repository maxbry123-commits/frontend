---
name: crosvm-cl-tool
description: Skill to assist with using the `./tools/cl` tool for managing and uploading Gerrit CLs in the crosvm repository.
---

# Crosvm CL Tool (`./tools/cl`)

The `./tools/cl` script is a custom tool in the `crosvm` repository used to manage local branches
and upload changes to the upstream Gerrit review site (`https://chromium-review.googlesource.com`).

It wraps `git push` with the correct Gerrit refs and options, and helps rebase changes when tracking
downstream branches.

## Prerequisites

To use this tool, you must be on a local branch that tracks a remote branch (typically
`origin/main`). You can set this up when creating a branch:

```bash
git checkout -b mybranch --track origin/main
```

If you are already on a branch, you can set the upstream manually:

```bash
git branch --set-upstream-to origin/main
```

## Subcommands

### 1. `status`

Lists all local branches, their tracking status, and the status of their local commits on Gerrit
(e.g., `MERGED`, `ABANDONED`, `NEW`, `NOT_UPLOADED`).

```bash
./tools/cl status
```

### 2. `upload`

Uploads local commits on the current branch to Gerrit.

```bash
./tools/cl upload [options]
```

**Options:**

- `-d`, `--dry-run`: Show the push command that would be run without actually executing it.
- `-r`, `--reviewer <email>`: Add a reviewer. Can be repeated to add multiple reviewers.
- `-a`, `--auto-submit`: Set `Auto-Submit+1` and `Commit-Queue+1` labels on Gerrit.
- `-s`, `--submit`: Set `Commit-Queue+2` (trigger immediate submit after approval).
- `-t`, `--try`: Set `Commit-Queue+1` (trigger try jobs / dry run).

### 3. `rebase`

Helps rebase changes if you are tracking a different branch (e.g., `aosp/main` or `cros/chromeos`)
and want to upload to upstream `origin/main`.

It creates a new branch named `<current-branch>-upstream` tracking `origin/main` and cherry-picks
your local commits onto it.

```bash
./tools/cl rebase
```

**Rebase Workflow:**

1. Run the rebase command:
   ```bash
   ./tools/cl rebase
   ```
1. If there are conflicts, resolve them manually:
   ```bash
   # Resolve conflicts in files...
   git add <resolved-files>
   git cherry-pick --continue
   ```
1. Once the rebase/cherry-pick is complete, upload from the new `-upstream` branch:
   ```bash
   ./tools/cl upload
   ```

### 4. `prune`

Cleans up your local repository by deleting local branches whose changes have already been merged or
abandoned on Gerrit.

```bash
./tools/cl prune [options]
```

**Options:**

- `-f`, `--force`: Force delete the branches without prompting for confirmation.
