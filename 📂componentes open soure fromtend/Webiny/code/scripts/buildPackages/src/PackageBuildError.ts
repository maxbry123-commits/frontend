import { Package } from "./types";

export class PackageBuildError extends Error {
    private pkg: Package;
    private error: Error;

    constructor(pkg: Package, error: Error) {
        super("PackageBuildError");
        this.pkg = pkg;
        this.error = error;
    }

    getPackage() {
        return this.pkg;
    }

    getBuildError() {
        return this.error;
    }
}
