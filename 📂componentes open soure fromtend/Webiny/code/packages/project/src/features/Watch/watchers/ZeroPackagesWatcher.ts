import { BasePackagesWatcher } from "./BasePackagesWatcher.js";
import { RunnableWatchProcesses } from "./RunnableWatchProcesses.js";

export class ZeroPackagesWatcher extends BasePackagesWatcher {
    public override prepare() {
        // Don't do anything. There are no packages to watch.
        return new RunnableWatchProcesses([]);
    }
}
