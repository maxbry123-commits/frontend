import { type BuildApp } from "~/abstractions/index.js";
import { type IRunnableBuildProcesses } from "./IRunnableBuildProcesses.js";

export interface IBasePackagesBuilderPackage {
    name: string;
    webinyConfig: Record<string, any>;
    paths: {
        packageFolder: string;
        webinyConfigFile: string;
    };
}

export type BeforeAfterBuildCallback = (params: BuildApp.Params) => void | Promise<void>;

export interface IPackagesBuilder {
    prepare(): IRunnableBuildProcesses;

    getPackages(): IBasePackagesBuilderPackage[];

    onBeforeBuild(callback: BeforeAfterBuildCallback): void;
    onAfterBuild(callback: BeforeAfterBuildCallback): void;

    getOnBeforeBuildCallbacks(): BeforeAfterBuildCallback[];
    getOnAfterBuildCallbacks(): BeforeAfterBuildCallback[];

    getBuildParams(): BuildApp.Params;
}
