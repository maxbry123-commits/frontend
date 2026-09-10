import type { Document, StyleValueBinding } from "~/types.js";
import type { IDocumentOperation } from "./IDocumentOperation.js";

export class SetStyleBindingOverride implements IDocumentOperation {
    private readonly elementId: string;
    private breakpoint: string;
    private readonly bindingPath: string;
    private readonly binding: StyleValueBinding;

    constructor(
        elementId: string,
        bindingPath: string,
        binding: StyleValueBinding,
        breakpoint: string
    ) {
        this.elementId = elementId;
        this.bindingPath = bindingPath;
        this.binding = binding;
        this.breakpoint = breakpoint;
    }

    apply(document: Document) {
        const bindings = document.bindings[this.elementId] ?? {};
        const breakpointOverrides = bindings.overrides
            ? (bindings.overrides[this.breakpoint] ?? {})
            : { styles: {} };

        const binding = breakpointOverrides.styles
            ? // @ts-expect-error String doesn't play well with CSSProperties.
              breakpointOverrides.styles[this.bindingPath]
            : {};

        document.bindings[this.elementId] = {
            ...bindings,
            overrides: {
                ...(bindings.overrides || {}),
                [this.breakpoint]: {
                    ...breakpointOverrides,
                    styles: {
                        ...(breakpointOverrides.styles || {}),
                        [this.bindingPath]: {
                            ...binding,
                            ...this.binding
                        }
                    }
                }
            }
        };
    }
}
