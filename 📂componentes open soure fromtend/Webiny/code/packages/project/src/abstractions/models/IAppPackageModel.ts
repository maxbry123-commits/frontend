export interface IAppPackageModel {
    name: string;
    paths: {
        packageFolder: string;
        packageJsonFile: string;
        webinyConfigFile: string;
    };

    packageJson: Record<string, any>;
}
