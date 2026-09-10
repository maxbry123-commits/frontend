import type { ComponentGroup } from "./types.js";
import { contentSdk } from "./ContentSdk.js";

export const registerComponentGroup = (group: ComponentGroup) => {
    const editingSdk = contentSdk.getEditingSdk();

    if (!editingSdk) {
        return;
    }

    editingSdk.registerComponentGroup(group);
};
