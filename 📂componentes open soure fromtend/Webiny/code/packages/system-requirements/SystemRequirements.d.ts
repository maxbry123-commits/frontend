export interface SystemRequirements {
    getNodeVersion(): string;
    getOsVersion(): string;
    getNpxVersion(): string;
    getYarnVersion(): string;
    getNpmVersion(): string;
    getPulumiVersion(): [string, string];
    getIsCi(): boolean;
}

export const SystemRequirements: SystemRequirements;
