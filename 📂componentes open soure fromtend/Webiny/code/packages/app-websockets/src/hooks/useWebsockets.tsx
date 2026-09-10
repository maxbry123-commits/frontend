import { useContext } from "react";
import { WebsocketsContext } from "~/WebsocketsContextProvider.js";
import type { IWebsocketsContext } from "~/types.js";

export const useWebsockets = (): IWebsocketsContext => {
    const context = useContext(WebsocketsContext);
    if (!context) {
        throw new Error("useWebsockets must be used within a SocketsProvider");
    }
    return context;
};
