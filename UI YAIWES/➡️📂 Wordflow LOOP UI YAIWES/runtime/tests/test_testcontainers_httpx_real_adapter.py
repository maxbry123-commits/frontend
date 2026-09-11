import io
import os
from pathlib import Path
import subprocess
import sys
import tarfile
import tempfile
import textwrap
import unittest


TESTCONTAINERS_REPO_PATH = "UI YAIWES/componentes open soure UI YAIWES/Testcontainers Python/code"
EXPECTED_SOURCE_TREE_SHA256 = "ebc82b8782a0e2ef5417afc432079df34260e81a648f6a7a48663e13f70eab70"
PIP_INSTALL_TIMEOUT_SECONDS = 120
LIFECYCLE_TIMEOUT_SECONDS = 180


class TestcontainersHttpxRealAdapterLifecycle(unittest.TestCase):
    def test_disposable_nginx_through_yaiwes_httpx_adapter(self):
        repo_root = Path(
            subprocess.check_output(["git", "rev-parse", "--show-toplevel"], text=True).strip()
        )
        archive = subprocess.check_output(
            ["git", "-C", str(repo_root), "archive", "--format=tar", "HEAD", "--", TESTCONTAINERS_REPO_PATH]
        )

        with tempfile.TemporaryDirectory(prefix="yaiwes-testcontainers-") as tmp:
            tmp_path = Path(tmp)
            with tarfile.open(fileobj=io.BytesIO(archive), mode="r:") as tf:
                tf.extractall(tmp_path)

            source_root = tmp_path / TESTCONTAINERS_REPO_PATH
            self.assertTrue((source_root / "pyproject.toml").is_file())
            try:
                subprocess.run(
                    [
                        sys.executable,
                        "-m",
                        "pip",
                        "install",
                        "--disable-pip-version-check",
                        "--quiet",
                        str(source_root),
                        "httpx==0.28.1",
                    ],
                    check=True,
                    timeout=PIP_INSTALL_TIMEOUT_SECONDS,
                )
            except subprocess.TimeoutExpired as exc:
                self.fail(
                    f"Testcontainers local-source dependency install exceeded "
                    f"{PIP_INSTALL_TIMEOUT_SECONDS}s: {exc}"
                )

            runtime_src = repo_root / "UI YAIWES/➡️📂 Wordflow LOOP UI YAIWES/runtime/src"
            script = textwrap.dedent(
                """
                import os
                import time
                import docker
                import docker.errors
                import httpx
                from testcontainers.core.container import DockerContainer
                from plugins.httpx_adapter import HttpxDependencies, create_httpx_runtime

                os.environ["TESTCONTAINERS_RYUK_DISABLED"] = "true"
                container_id = None
                with DockerContainer("nginx:1.27-alpine").with_exposed_ports(80) as container:
                    container_id = container.get_container_id()
                    host = container.get_container_host_ip()
                    port = container.get_exposed_port(80)
                    runtime = create_httpx_runtime(
                        HttpxDependencies(
                            httpx.Client,
                            httpx.AsyncClient,
                            httpx.__version__,
                            {"trust_env": False, "timeout": 2.0},
                        )
                    )
                    last_error = None
                    for _ in range(30):
                        try:
                            response = runtime.request("GET", f"http://{host}:{port}/")
                            if response.status_code == 200:
                                break
                        except Exception as exc:
                            last_error = exc
                        time.sleep(0.5)
                    else:
                        raise AssertionError(f"nginx never became reachable: {last_error!r}")
                    assert b"Welcome to nginx" in response.content

                client = docker.from_env()
                try:
                    client.containers.get(container_id)
                except docker.errors.NotFound:
                    pass
                else:
                    raise AssertionError("Testcontainers lifecycle did not remove disposable container")
                finally:
                    client.close()
                print("YAIWES_TESTCONTAINERS_HTTPX_LIFECYCLE=PASS")
                """
            )
            env = os.environ.copy()
            env["PYTHONPATH"] = str(runtime_src)
            try:
                result = subprocess.run(
                    [sys.executable, "-c", script],
                    cwd=repo_root,
                    env=env,
                    text=True,
                    capture_output=True,
                    check=False,
                    timeout=LIFECYCLE_TIMEOUT_SECONDS,
                )
            except subprocess.TimeoutExpired as exc:
                stdout = exc.stdout or ""
                stderr = exc.stderr or ""
                self.fail(
                    "real adapter lifecycle timed out deterministically\n"
                    f"timeout_seconds={LIFECYCLE_TIMEOUT_SECONDS}\n"
                    f"stdout:\n{stdout}\n"
                    f"stderr:\n{stderr}"
                )

            if result.returncode != 0:
                self.fail(
                    "real adapter lifecycle failed\n"
                    f"stdout:\n{result.stdout}\n"
                    f"stderr:\n{result.stderr}"
                )
            self.assertIn("YAIWES_TESTCONTAINERS_HTTPX_LIFECYCLE=PASS", result.stdout)


if __name__ == "__main__":
    unittest.main()
