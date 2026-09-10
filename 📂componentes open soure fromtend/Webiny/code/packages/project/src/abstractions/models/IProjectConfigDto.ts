import { type ExtensionInstanceModel } from "~/defineExtension/models/index.js";

export type ExtensionType = string;

export type ExtensionDto = Record<string, any>;
export type IProjectConfigDto = Record<ExtensionType, ExtensionDto | Array<ExtensionDto>>;

export type IHydratedProjectConfig = Record<
    ExtensionType,
    ExtensionInstanceModel<any> | Array<ExtensionInstanceModel<any>>
>;
