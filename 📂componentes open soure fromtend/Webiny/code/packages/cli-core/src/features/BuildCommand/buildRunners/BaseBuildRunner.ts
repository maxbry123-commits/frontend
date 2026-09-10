import { StdioService, UiService } from "~/abstractions/index.js";
import { IPackagesBuilder } from "@webiny/project/abstractions/models/index.js";

export interface IBaseBuildRunnerParams {
    packagesBuilder: IPackagesBuilder;
    stdio: StdioService.Interface;
    ui: UiService.Interface;
}

export class BaseBuildRunner {
    public readonly packagesBuilder: IPackagesBuilder;
    public readonly stdio: StdioService.Interface;
    public readonly ui: UiService.Interface;

    public constructor({ packagesBuilder, stdio, ui }: IBaseBuildRunnerParams) {
        this.packagesBuilder = packagesBuilder;
        this.stdio = stdio;
        this.ui = ui;
    }

    public async run(): Promise<void> {
        throw new Error("Not implemented.");
    }
}
