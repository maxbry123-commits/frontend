---
name: crosvm-contribution-workflow
description: Skill to assist with the contribution workflow for crosvm. ALL agents making code changes MUST use this skill to run presubmit checks before committing.
---

# Contribution Workflow Skill

This skill assists with the crosvm contribution workflow. ALL agents making code changes MUST use
this skill to verify their changes (by compiling and running tests) before proceeding to commit or
requesting review, even if the user does not explicitly ask to run tests.

## Formatting and Presubmit Checks

All commands must be executed from the repository root directory.

### Choosing the Right Test Method

Depending on the scope of your changes, choose the appropriate method to verify your work. The
relevant checks must pass before you proceed to create a commit or request review.

- **`./tools/dev_container cargo check`**

  - **Usage**: Use this during normal development iterations.
  - **Description**: It attempts to compile the project with the default feature set. Fast and
    useful for quick feedback on syntax and basic type checking.

- **`tools/dev_container ./tools/presubmit quick`**

  - **Usage**: Run this as a minimum sanity check before creating a commit.
  - **Description**: Performs a health check, runs unit tests on x86, and runs clippy lints.

- **`tools/dev_container ./tools/presubmit`**

  - **Usage**: Run this when you have made changes that might affect multiple platforms or are more
    substantial.
  - **Description**: In addition to the quick checks, this performs cross-compilation and runs unit
    tests for other targets. **Note: The default set does not cover all platforms (e.g., riscv).**

- **`tools/dev_container ./tools/presubmit clippy`**

  - **Usage**: Run this to quickly check all platforms (including riscv) for cross-platform changes.
  - **Description**: Runs clippy lints for all supported platforms. This is a relatively quick way
    to ensure your changes don't break compilation on any platform.

- **`tools/dev_container ./tools/presubmit all`**

  - **Usage**: Run this before final submission or for complex changes that require full validation.
  - **Description**: This is the most thorough check. It runs all the above tests on all supported
    platforms, including end-to-end (e2e) tests using QEMU. **Note: This takes a significant amount
    of time.**

### Commands

#### 1. Auto-formatting

Automatically fixes code formatting. This also applies to Markdown files (`.md`) in addition to
source code.

```bash
tools/dev_container ./tools/fmt
```

#### 2. Running Checks

Use one of the methods described above. Example for quick check:

```bash
tools/dev_container ./tools/presubmit quick
```

> [!TIP] If your tests fail on presubmit and you need to debug the tests individually or inspect the
> VM environment, please refer to the crosvm-testing [SKILL.md](../crosvm_testing/SKILL.md).

## Uploading Changes

Once your changes are verified and formatted, you can upload them to Gerrit for review.

We use a custom tool `./tools/cl` for this. The basic command to upload is:

```bash
./tools/cl upload
```

> [!TIP] For advanced usage of the CL tool, including rebasing downstream branches, checking CL
> status, and pruning old branches, see the specialized crosvm-cl-tool
> [SKILL.md](../crosvm_cl_tool/SKILL.md).

## Commit Message Guidelines

Refer to these guidelines when writing commit messages for crosvm. You **must** only write a commit
message AFTER ensuring all necessary tests pass.

### 1. Subject Line

- **Format**: Starts with a tag representing the component, followed by a colon and space, then the
  description.
  - Example: `devices: vhost: user: Add Connection type`
- **Tags**: Usually the name of the crate modified (e.g., `devices:`, `base:`). Use paths for
  specific components (e.g., `devices: vhost: user:`).
- **Length**: No more than 50 characters, including tags.

### 2. Body

- **Content**: State the motivation followed by the impact/action.
- **Wrapping**: Text must be wrapped to 72 characters.

### 3. BUG Lines

- **Format**: `BUG=b:<bug number>` for Google issue tracker, or `BUG=None`.
- You can have multiple `BUG` lines.
- **Tip**: If you do not know the bug number, ask the user for clarification.

### 4. TEST Lines

- **Format**: Describe how the change was tested in free form.
- You can have multiple `TEST` lines.

### 5. Change-Id

- The gerrit commit message hook will insert this automatically if the commit-msg hook is installed.
- **Important**: The `Change-Id` links the commit to a specific Gerrit change list (CL). Unless
  explicitly requested by the user, **DO NOT** change or remove the `Change-Id` when cherry-picking,
  rebasing, or amending commits.

### Example Commit Message

```
devices: vhost: user: vmm: Add Connection type

This abstracts away the cross-platform differences:
cfg(any(target_os = "android", target_os = "linux")) uses a Unix
domain domain stream socket to connect to the vhost-user backend, and
cfg(windows) uses a Tube.

BUG=b:249361790
TEST=tools/presubmit all

Change-Id: I47651060c2ce3a7e9f850b7ed9af8bd035f82de6
```

## End-to-End Contribution Journey

Here is the typical sequence of steps for contributing a change:

1. **Start a branch**:
   ```bash
   git checkout -b my-feature-branch --track origin/main
   ```
1. **Make changes** and implement your feature or fix.
1. **Format your code**:
   ```bash
   tools/dev_container ./tools/fmt
   ```
1. **Run presubmit checks**:
   ```bash
   tools/dev_container ./tools/presubmit quick
   ```
   *(If tests fail and you need to debug individually or inspect the VM environment, refer to the
   crosvm-testing [SKILL.md](../crosvm_testing/SKILL.md)).*
1. **Commit your changes** (following the [Commit Message Guidelines](#commit-message-guidelines)):
   ```bash
   git commit
   ```
1. **Upload the CL**:
   ```bash
   ./tools/cl upload
   ```
   *(Refer to the crosvm-cl-tool [SKILL.md](../crosvm_cl_tool/SKILL.md) if you need to add
   reviewers, trigger try jobs, or rebase).*
