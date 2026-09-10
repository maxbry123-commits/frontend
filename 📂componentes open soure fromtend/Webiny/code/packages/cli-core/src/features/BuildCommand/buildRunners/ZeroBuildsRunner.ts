import { BaseBuildRunner } from "./BaseBuildRunner.js";

export class ZeroBuildsRunner extends BaseBuildRunner {
    public override async run() {
        // Do nothing.
    }
}
