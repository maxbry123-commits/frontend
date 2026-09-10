import { type GetApp } from "~/abstractions/index.js";
import { type IPathModel } from "./IPathModel.js";

export interface IAppModelDto {
    name: GetApp.AppName;
    paths: {
        workspaceFolder: string;
        localPulumiStateFilesFolder: string;
    };
}

export interface IAppModel {
    name: GetApp.AppName;
    paths: {
        workspaceFolder: IPathModel;
        localPulumiStateFilesFolder: IPathModel;
    };

    getDisplayName(): string;
}
