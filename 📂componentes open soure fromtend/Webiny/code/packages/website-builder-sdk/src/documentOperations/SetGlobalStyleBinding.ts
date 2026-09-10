import type { Document, StyleValueBinding } from "~/types.js";
import type { IDocumentOperation } from "./IDocumentOperation.js";

export class SetGlobalStyleBinding implements IDocumentOperation {
    private readonly elementId: string;
    private readonly bindingPath: string;
    private readonly binding: StyleValueBinding;

    constructor(elementId: string, bindingPath: string, binding: StyleValueBinding) {
        this.elementId = elementId;
        this.bindingPath = bindingPath;
        this.binding = binding;
    }

    apply(document: Document) {
        const bindings = document.bindings[this.elementId] ?? { styles: {} };
        // @ts-expect-error String doesn't play well with CSSProperties.
        const binding = bindings.styles ? (bindings.styles[this.bindingPath] ?? {}) : {};
        document.bindings[this.elementId] = {
            ...bindings,
            styles: {
                ...bindings.styles,
                [this.bindingPath]: {
                    ...binding,
                    ...this.binding
                }
            }
        };
    }
}
