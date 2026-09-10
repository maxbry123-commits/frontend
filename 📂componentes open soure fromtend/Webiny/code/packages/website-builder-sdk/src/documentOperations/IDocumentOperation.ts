import type { Document } from "~/types.js";

export interface IDocumentOperation {
    apply(document: Document): void;
}
