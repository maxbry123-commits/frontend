import { createGenericContext } from "@webiny/app-admin";
import type { DropZoneManager } from "./DropZoneManager.js";

const DropZoneManagerContext = createGenericContext<{ dropzoneManager: DropZoneManager }>(
    "DropzoneManager"
);

export const DropZoneManagerProvider = DropZoneManagerContext.Provider;

export const useDropZoneManager = () => {
    const { dropzoneManager } = DropZoneManagerContext.useHook();

    return dropzoneManager;
};
