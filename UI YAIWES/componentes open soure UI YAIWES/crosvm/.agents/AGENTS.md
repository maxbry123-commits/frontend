# Agent Rules for crosvm

## CL Management and Git Workflow

### Gerrit CL Updates

- **Maintain Change-Id**: When amending commits to update an existing Gerrit CL, always preserve the
  original `Change-Id` line at the bottom of the commit message. Never remove, modify, or lose the
  existing Change-Id, to ensure updates are correctly pushed as new patchsets to the same CL rather
  than creating duplicates.

### Commit Messages

- **Wrapping**: Always wrap the commit message body to 75 columns.

## Contribution Workflow

### Mandatory Skill Usage

- **Verify Changes**: You MUST use the crosvm-contribution-workflow
  [SKILL.md](skills/crosvm_contribution_workflow/SKILL.md) to format and run presubmit checks before
  committing or uploading any code changes. Do not skip this step even if not explicitly asked by
  the user.
