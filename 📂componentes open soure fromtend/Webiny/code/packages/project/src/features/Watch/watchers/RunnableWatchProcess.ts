import { type IBasePackagesWatcherPackage } from "./BasePackagesWatcher.js";
import { fork, type ForkOptions } from "child_process";
import path from "path";
import { type Watch } from "~/abstractions/index.js";

export interface RunnableProcessParams {
    buildParams: Watch.Params;
    pkg: IBasePackagesWatcherPackage;
    forkOptions?: ForkOptions;
}

export class RunnableWatchProcess {
    buildParams: Watch.Params;
    pkg: IBasePackagesWatcherPackage;
    forkOptions: ForkOptions | undefined;
    pipeStdoutCallback: ((stdout: NodeJS.ReadableStream) => void) | undefined;
    pipeStderrCallback: ((stderr: NodeJS.ReadableStream) => void) | undefined;
    constructor(params: RunnableProcessParams) {
        this.buildParams = params.buildParams;
        this.pkg = params.pkg;
        this.forkOptions = params.forkOptions || {
            env: { ...process.env },
            stdio: ["pipe", "pipe", "pipe", "ipc"]
        };
    }

    run() {
        const workerPath = path.resolve(import.meta.dirname, "worker.js");

        const buildProcess = fork(
            workerPath,
            [JSON.stringify({ ...this.buildParams, package: this.pkg })],
            this.forkOptions
        );

        if (this.pipeStdoutCallback && buildProcess.stdout) {
            this.pipeStdoutCallback(buildProcess.stdout);
        }

        if (this.pipeStderrCallback && buildProcess.stderr) {
            this.pipeStderrCallback(buildProcess.stderr);
        }

        return new Promise<void>((resolve, reject) => {
            buildProcess.on("exit", code => {
                if (code === 0) {
                    resolve();
                } else {
                    reject(
                        new Error(
                            `Build failed for package ${this.pkg.name} with exit code ${code}`
                        )
                    );
                }
            });
        });
    }

    setForkOptions(options: ForkOptions) {
        this.forkOptions = options;
    }

    pipeStdout(callback: (stdout: NodeJS.ReadableStream) => void) {
        this.pipeStdoutCallback = callback;
    }

    pipeStderr(callback: (stderr: NodeJS.ReadableStream) => void) {
        this.pipeStderrCallback = callback;
    }
}
