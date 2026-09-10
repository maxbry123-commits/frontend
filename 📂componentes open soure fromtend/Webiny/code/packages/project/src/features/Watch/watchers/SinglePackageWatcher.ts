import { BasePackagesWatcher } from "./BasePackagesWatcher.js";
import { RunnableWatchProcess } from "./RunnableWatchProcess.js";
import { RunnableWatchProcesses } from "./RunnableWatchProcesses.js";

export class SinglePackageWatcher extends BasePackagesWatcher {
    public override prepare() {
        const [pkg] = this.packages;

        return new RunnableWatchProcesses([
            new RunnableWatchProcess({
                buildParams: this.params,
                pkg
            })
        ]);
    }
}
