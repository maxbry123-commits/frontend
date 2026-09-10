import type { IWebsocketsSubscriptionManager } from "./IWebsocketsSubscriptionManager.js";
import type { IGenericData, WebsocketsCloseCode } from "./types.js";

export type IWebsocketsConnectProtocol = string | string[] | undefined;

export interface IWebsocketsConnectionFactory {
    (url: string, protocol?: IWebsocketsConnectProtocol): WebSocket;
}

export enum WebsocketsReadyState {
    CONNECTING = 0,
    OPEN = 1,
    CLOSING = 2,
    CLOSED = 3
}

export interface IWebsocketsConnection {
    readonly subscriptionManager: IWebsocketsSubscriptionManager;

    isConnected(): boolean;
    isClosed(): boolean;

    connect(): Promise<void>;
    close(code: WebsocketsCloseCode, reason: string): Promise<boolean>;
    send<T extends IGenericData = IGenericData>(data: T): void;
}
