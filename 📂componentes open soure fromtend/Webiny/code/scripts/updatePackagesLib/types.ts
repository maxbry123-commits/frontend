export { PackageJson } from "type-fest";
import type { SemVer } from "semver";

export interface IBasicPackage {
    name: string;
    version: SemVer;
}

export interface IVersionedPackage extends IBasicPackage {
    latestVersion: SemVer;
}
