---
name: crosvm-testing
description: Skill to assist with running tests and managing test VMs in the crosvm repository.
---

# Crosvm Testing (`tools/run_tests` & `tools/testvm`)

This skill covers running the `crosvm` test suite and managing the virtual machines used for
integration testing.

> [!TIP] When you have completed your code changes and are ready to commit or upload, please run the
> overall presubmit checks according to the crosvm-contribution-workflow
> [SKILL.md](../crosvm_contribution_workflow/SKILL.md).

## Running Tests (`tools/run_tests`)

The `tools/run_tests` script is the primary test runner. It supports unit tests (running on the host
or via emulators) and integration tests (running on a test VM or the host).

### 1. Unit Tests

- **Run host native unit tests**:
  ```bash
  ./tools/run_tests
  ```
- **Run unit tests for a specific platform (via emulator)**:
  ```bash
  ./tools/run_tests -p <platform>
  ```
  Supported platforms: `x86_64`, `aarch64`, `armhw`, `mingw64`, `riscv64`. *Example for ARM64*:
  `./tools/run_tests -p aarch64` *Example for Windows (via Wine)*: `./tools/run_tests -p mingw64`

### 2. Integration Tests

Integration tests require a Device Under Test (DUT).

- **Run integration tests on a Test VM (Recommended)**:
  ```bash
  ./tools/run_tests --dut=vm
  ```
  This will automatically start a test VM, run the tests inside it, and keep the VM running for
  subsequent runs.
- **Run integration tests on the Host**:
  ```bash
  ./tools/run_tests --dut=host
  ```
  *Note: This may not work on all host configurations and might require root.*

### 3. Test Filtering

The runner supports `nextest` filter expressions using the `-E` or `--filter-expr` flag. See
[nextest documentation](https://nexte.st/book/filter-expressions.html) for details.

- **Run tests for a specific package**:
  ```bash
  ./tools/run_tests -E 'package(devices)'
  ```
- **Run a specific test by name**:
  ```bash
  ./tools/run_tests -E 'test(test_send_cmd_not_ready)'
  ```
- **Run tests for a package and its dependencies**:
  ```bash
  ./tools/run_tests -E 'deps(vm_control)'
  ```

### 4. Useful Flags

- `--no-unit-tests`: Skip unit tests and only run integration tests.
- `--no-integration-tests`: Skip integration tests.
- `--run-root-tests`: Enable integration tests that require root privileges.
- `--retries <N>`: Retry failed tests N times.
- `--repetitions <N>`: Repeat all tests N times (useful for detecting flakiness).

______________________________________________________________________

## Managing Test VMs (`tools/testvm`, `tools/x86vm`, `tools/aarch64vm`)

For integration testing (`--dut=vm`), `crosvm` uses test VMs. You can manage these VMs using
`tools/x86vm` (for x86_64) or `tools/aarch64vm` (for ARM64). These are wrappers around
`tools/testvm`.

Replace `x86vm` with `aarch64vm` in the commands below depending on the architecture you are
testing.

- **Start the VM**:
  ```bash
  ./tools/x86vm up
  ```
- **Open an interactive SSH shell into the VM**:
  ```bash
  ./tools/x86vm shell
  ```
  *(This will start the VM if it is not already running).*
- **Stop the VM gracefully**:
  ```bash
  ./tools/x86vm stop
  ```
- **Force kill the VM**:
  ```bash
  ./tools/x86vm kill
  ```
- **View VM console logs**:
  ```bash
  ./tools/x86vm logs
  ```
- **Clean/Reset the VM (deletes images)**:
  ```bash
  ./tools/x86vm clean
  ```
