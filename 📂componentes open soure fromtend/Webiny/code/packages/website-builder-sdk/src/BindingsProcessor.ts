import type { DocumentElementBindings, CssProperties } from "~/types.js";

type RequiredBindings<T extends DocumentElementBindings> = T & {
    inputs: NonNullable<T["inputs"]>;
    styles: NonNullable<T["styles"]>;
};

export class BindingsProcessor {
    private readonly breakpoints: string[];

    constructor(breakpoints: string[]) {
        this.breakpoints = breakpoints;
    }

    public getBindings(bindings: DocumentElementBindings, breakpoint: string) {
        const result: RequiredBindings<DocumentElementBindings> = {
            $repeat: bindings.$repeat,
            inputs: { ...(bindings.inputs || {}) },
            styles: { ...(bindings.styles || {}) }
        };

        const overrides = bindings.overrides ?? {};

        let upTo = this.breakpoints.indexOf(breakpoint);
        if (upTo === -1) {
            upTo = 0;
        }

        for (let i = 0; i <= upTo; i++) {
            const bp = this.breakpoints[i];
            const override = overrides[bp];
            if (!override) {
                continue;
            }

            if (override.inputs) {
                for (const key in override.inputs) {
                    result.inputs[key] = {
                        ...(result.inputs![key] || {}),
                        ...override.inputs[key]
                    };
                }
            }

            if (override.styles) {
                for (const styleKey in override.styles) {
                    const key = styleKey as keyof CssProperties;
                    // @ts-expect-error It's hard to make CSS properties happy.
                    result.styles[key] = {
                        ...(result.styles[key] || {}),
                        ...override.styles[key]
                    };
                }
            }
        }

        return result;
    }
}
