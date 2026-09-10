import { type BuildApp, type LoggerService } from "~/abstractions/index.js";
import { RunnableBuildProcesses } from "./RunnableBuildProcesses.js";
import { RunnableBuildProcess } from "./RunnableBuildProcess.js";
import { type IPackagesBuilder } from "~/abstractions/models/index.js";

export interface IBasePackagesBuilderPackage {
    name: string;
    webinyConfig: Record<string, any>;
    paths: {
        packageFolder: string;
        webinyConfigFile: string;
    };
}

export type BeforeAfterBuildCallback = (params: BuildApp.Params) => void | Promise<void>;

export interface IBasePackagesBuilderParams {
    packages: IBasePackagesBuilderPackage[];
    logger: LoggerService.Interface;
    params: BuildApp.Params;
}

export class PackagesBuilder implements IPackagesBuilder {
    public readonly packages: IBasePackagesBuilderPackage[];
    public readonly params: BuildApp.Params;
    public readonly logger: LoggerService.Interface;

    beforeBuildCallbacks: BeforeAfterBuildCallback[] = [];
    afterBuildCallbacks: BeforeAfterBuildCallback[] = [];

    public constructor({ packages, params, logger }: IBasePackagesBuilderParams) {
        this.packages = packages;
        this.params = params;
        this.logger = logger;
    }

    public prepare(): RunnableBuildProcesses {
        const packages = this.packages;

        return new RunnableBuildProcesses(
            this,
            packages.map(pkg => {
                return new RunnableBuildProcess({
                    builder: this,
                    pkg
                });
            })
        );
    }

    public getPackages() {
        return this.packages;
    }

    public onBeforeBuild(callback: BeforeAfterBuildCallback) {
        this.beforeBuildCallbacks.push(callback);
    }

    public onAfterBuild(callback: BeforeAfterBuildCallback) {
        this.afterBuildCallbacks.push(callback);
    }

    public getOnBeforeBuildCallbacks() {
        return this.beforeBuildCallbacks;
    }

    public getOnAfterBuildCallbacks() {
        return this.afterBuildCallbacks;
    }

    public getBuildParams() {
        return this.params;
    }
}
