import type { FieldRendererConfig } from "./FieldRenderer.js";
import { FieldRenderer } from "./FieldRenderer.js";

export interface AdvancedSearchConfig {
    fieldRenderers: FieldRendererConfig[];
}

export const AdvancedSearch = {
    FieldRenderer
};
