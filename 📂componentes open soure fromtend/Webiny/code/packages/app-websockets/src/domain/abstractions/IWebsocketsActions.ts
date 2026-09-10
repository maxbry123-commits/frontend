import type { IWebsocketsManager } from "./IWebsocketsManager.js";
import type { IGenericData } from "./types.js";

export interface IWebsocketsActionsRunParams<T extends IGenericData = IGenericData> {
    action: string;
    data?: T;
    timeout?: number;
}

export interface IWebsocketsActions {
    manager: IWebsocketsManager;
    run<T extends IGenericData = IGenericData, R extends IGenericData = IGenericData>(
        params: IWebsocketsActionsRunParams<T>
    ): Promise<R | null>;
}
