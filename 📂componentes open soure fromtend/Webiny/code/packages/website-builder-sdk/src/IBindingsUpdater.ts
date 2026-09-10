import type { JsonPatchOperation } from "~/jsonPatch.js";
import type { Document, DocumentElementBindings } from "~/types.js";

export interface IBindingsUpdater {
    applyToDocument(document: Document): void;
    createJsonPatch(bindings: DocumentElementBindings): JsonPatchOperation[];
}
