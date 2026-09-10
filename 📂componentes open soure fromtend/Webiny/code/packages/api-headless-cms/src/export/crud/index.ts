import type { CmsContext } from "~/types/index.js";
import { createExportStructureContext } from "./exporting.js";

export const createExportCrud = (context: CmsContext) => {
    return {
        structure: createExportStructureContext(context)
    };
};
