import type { ValueBinding } from "~/types.js";

export interface GetBreakpointBindings {
    (breakpoint: string): Record<string, ValueBinding> | undefined;
}

export class InheritedValueResolver {
    private readonly breakpoints: string[];
    private readonly getBindings: GetBreakpointBindings;

    constructor(breakpoints: string[], getBindings: GetBreakpointBindings) {
        this.breakpoints = breakpoints;
        this.getBindings = getBindings;
    }

    getInheritedValue(key: string, breakpoint: string): ValueBinding | undefined {
        const currentIndex = this.breakpoints.indexOf(breakpoint);
        // Walk backwards from currentIndex - 1 to 0
        for (let i = currentIndex - 1; i >= 0; i--) {
            const bp = this.breakpoints[i];
            const bindings = this.getBindings(bp);

            if (!bindings) {
                continue;
            }

            const value = bindings[key]?.static;
            if (value !== undefined) {
                return value;
            }
        }
        return undefined;
    }
}
