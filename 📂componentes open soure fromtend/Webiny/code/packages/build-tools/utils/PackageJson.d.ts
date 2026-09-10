export declare class PackageJson {
    private readonly filePath: string;
    private readonly json: Record<string, any>;

    private constructor(filePath: string, json: Record<string, any>);

    /**
     * Load a PackageJson instance from a given file path.
     */
    static fromFile(filePath: string): PackageJson;

    /**
     * Find the closest package.json starting from the given path.
     * Throws if no package.json is found.
     */
    static findClosest(fromPath: string): Promise<PackageJson>;

    /**
     * Load a PackageJson instance from a package in node_modules.
     * Throws if the package.json cannot be found.
     */
    static fromPackage(packageName: string, cwd?: string): Promise<PackageJson>;

    /**
     * Get the absolute path to this package.json file.
     */
    getLocation(): string;

    /**
     * Get the raw JSON contents of the package.json file.
     */
    getJson(): Record<string, any>;
}
