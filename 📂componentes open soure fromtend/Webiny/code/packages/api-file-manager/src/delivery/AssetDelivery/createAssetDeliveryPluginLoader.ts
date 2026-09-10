import type { PluginFactory } from "@webiny/plugins/types.js";

export const createAssetDeliveryPluginLoader = (cb: PluginFactory): PluginFactory => {
    if (process.env.WEBINY_FUNCTION_TYPE === "asset-delivery") {
        return () => cb();
    }

    return () => Promise.resolve([]);
};
