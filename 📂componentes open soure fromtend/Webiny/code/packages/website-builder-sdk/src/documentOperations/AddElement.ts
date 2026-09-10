import type { Document, DocumentElement } from "~/types.js";
import type { IDocumentOperation } from "./IDocumentOperation.js";

export class AddElement implements IDocumentOperation {
    private readonly element: DocumentElement;

    constructor(element: DocumentElement) {
        this.element = element;
    }

    apply(document: Document) {
        document.elements[this.element.id] = this.element;
    }
}
