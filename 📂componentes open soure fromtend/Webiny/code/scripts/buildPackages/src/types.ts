export interface Package {
    isTs: boolean;
    mustBuild: boolean;
    hasTests: boolean;
    name: string;
    folderName: string;
    packageFolder: string;
    packageFolderRelativePath: string;
    packageJsonPath: string;
    tsConfigJsonPath: string;
    tsConfigBuildJsonPath: string;
    packageJson: Record<string, any>;
    tsConfigJson: Record<string, any>;
    tsConfigBuildJson: Record<string, any>;
}

export interface MetaJSON {
    packages: {
        [packageName: string]: {
            sourceHash: string;
        };
    };
}

export interface PackageJSON {
    webiny?: any;
    [key: string]: any;
}
