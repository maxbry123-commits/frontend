import type { Document } from "@webiny/website-builder-sdk";

export function $getElementById(document: Document, id: string) {
    return document.elements[id];
}
