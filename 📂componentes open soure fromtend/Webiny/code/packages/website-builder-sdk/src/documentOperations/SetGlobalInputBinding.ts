import type { Document, InputValueBinding } from "~/types.js";
import type { IDocumentOperation } from "./IDocumentOperation.js";

export class SetGlobalInputBinding implements IDocumentOperation {
    private readonly elementId: string;
    private readonly bindingPath: string;
    private readonly binding: InputValueBinding;

    constructor(elementId: string, bindingPath: string, binding: InputValueBinding) {
        this.elementId = elementId;
        this.bindingPath = bindingPath;
        this.binding = binding;
    }

    apply(document: Document) {
        const bindings = document.bindings[this.elementId] ?? { inputs: {} };
        const binding = bindings.inputs ? bindings.inputs[this.bindingPath] : {};
        document.bindings[this.elementId] = {
            ...bindings,
            inputs: {
                ...(bindings.inputs ?? {}),
                [this.bindingPath]: {
                    ...binding,
                    ...this.binding
                }
            }
        };
    }
}
