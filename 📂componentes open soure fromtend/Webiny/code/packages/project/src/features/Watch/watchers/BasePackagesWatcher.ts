import { type ListPackagesService, type LoggerService, type Watch } from "~/abstractions/index.js";

import { type RunnableWatchProcesses } from "./RunnableWatchProcesses.js";

export interface IBasePackagesWatcherParams {
    packages: IBasePackagesWatcherPackage[];
    logger: LoggerService.Interface;
    params: Watch.Params;
}

export type IBasePackagesWatcherPackage = ListPackagesService.Package;

export class BasePackagesWatcher {
    public readonly packages: IBasePackagesWatcherPackage[];
    public readonly params: Watch.Params;
    public readonly logger: LoggerService.Interface;

    public constructor({ packages, params, logger }: IBasePackagesWatcherParams) {
        this.packages = packages;
        this.params = params;
        this.logger = logger;
    }

    public prepare(): RunnableWatchProcesses {
        throw new Error("Not implemented.");
    }
}
