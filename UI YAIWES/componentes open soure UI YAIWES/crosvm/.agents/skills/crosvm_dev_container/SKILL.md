---
name: crosvm-dev-container
description: Skill to assist with using the `dev_container` tool for running builds, tests, and other tools in a consistent containerized environment.
---

# Crosvm Dev Container (`tools/dev_container`)

The `tools/dev_container` script is a wrapper used to run commands inside the official `crosvm`
development container. This ensures a consistent environment with all necessary dependencies
installed (such as compilers, libraries, and system tools).

It uses Podman by default, but can fall back to or be forced to use Docker.

## Basic Usage

To run any command inside the dev container, prefix it with `tools/dev_container`:

```bash
tools/dev_container <command>
```

### Common Examples:

- **Run cargo check**:
  ```bash
  tools/dev_container cargo check
  ```
- **Run presubmit checks**:
  ```bash
  tools/dev_container ./tools/presubmit quick
  ```
- **Run formatting**:
  ```bash
  tools/dev_container ./tools/fmt
  ```

## Key Options

- `--use-docker`: Force the script to use Docker instead of Podman.
- `--pull`: Pull the latest version of the container image from the registry before running the
  command.
- `--stop`: Stop the currently running container instance.
- `--clean`: Clean the container state (useful if the container gets into a bad state).
- `--no-interactive`: Run in non-interactive mode (useful for scripts or CI).
