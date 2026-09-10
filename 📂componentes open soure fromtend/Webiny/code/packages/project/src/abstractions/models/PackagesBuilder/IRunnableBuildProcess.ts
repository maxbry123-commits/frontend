import { type ForkOptions } from "child_process";

export interface IRunnableBuildProcessPackage {
    name: string;
    webinyConfig: Record<string, any>;
    paths: {
        packageFolder: string;
        webinyConfigFile: string;
    };
}

export interface IRunnableBuildProcess {
    run(): Promise<void>;

    setForkOptions(options: ForkOptions): void;

    getPackage(): IRunnableBuildProcessPackage;
}
