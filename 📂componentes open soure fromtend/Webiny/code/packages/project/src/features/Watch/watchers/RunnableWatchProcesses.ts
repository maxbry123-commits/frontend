import { type RunnableWatchProcess } from "./RunnableWatchProcess.js";
import { type ForkOptions } from "child_process";

export class RunnableWatchProcesses {
    runnableBuildProcesses: RunnableWatchProcess[];

    constructor(runnableBuildProcesses: RunnableWatchProcess[]) {
        this.runnableBuildProcesses = runnableBuildProcesses;
    }

    run() {
        return this.runnableBuildProcesses.map(runnableBuildProcess => runnableBuildProcess.run());
    }

    get length() {
        return this.runnableBuildProcesses.length;
    }

    setForkOptions(options: ForkOptions) {
        this.runnableBuildProcesses.forEach(runnableBuildProcess => {
            runnableBuildProcess.setForkOptions(options);
        });

        return this;
    }

    pipeStdout(callback: (stdout: NodeJS.ReadableStream) => void) {
        this.runnableBuildProcesses.forEach(runnableBuildProcess => {
            runnableBuildProcess.pipeStdout(callback);
        });

        return this;
    }

    pipeStderr(callback: (stderr: NodeJS.ReadableStream) => void) {
        this.runnableBuildProcesses.forEach(runnableBuildProcess => {
            runnableBuildProcess.pipeStderr(callback);
        });

        return this;
    }

    getProcesses() {
        return this.runnableBuildProcesses;
    }

    forEach(callback: (process: RunnableWatchProcess) => void) {
        this.runnableBuildProcesses.forEach(callback);
    }
}
