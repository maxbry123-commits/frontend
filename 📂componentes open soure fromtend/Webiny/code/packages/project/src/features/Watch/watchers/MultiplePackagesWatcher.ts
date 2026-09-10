import { BasePackagesWatcher } from "./BasePackagesWatcher.js";
import { RunnableWatchProcess } from "./RunnableWatchProcess.js";
import { RunnableWatchProcesses } from "./RunnableWatchProcesses.js";

export class MultiplePackagesWatcher extends BasePackagesWatcher {
    public override prepare() {
        const packages = this.packages;
        this.logger.debug(`Building %s packages...`, packages.length);
        this.logger.debug("The following packages will be watched for changes:", packages);

        return new RunnableWatchProcesses(
            packages.map(pkg => {
                return new RunnableWatchProcess({
                    buildParams: this.params,
                    pkg
                });
            })
        );
    }
}
