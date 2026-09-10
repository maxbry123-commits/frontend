import type { Document } from "@webiny/website-builder-sdk";

interface Params {
    elementId: string;
    parentId: string;
    slot: string;
}

export function $removeElementReferenceFromParent(
    document: Document,
    { elementId, parentId, slot }: Params
) {
    const bindings = document.bindings[parentId] ?? {};
    const inputs = bindings.inputs ?? {};

    const binding = inputs[slot];
    if (!binding) {
        return;
    }

    if (binding.list) {
        inputs[slot].static = (binding.static as string[]).filter(id => id !== elementId);
    } else {
        delete inputs[slot].static;
    }

    document.bindings[parentId] = {
        ...bindings,
        inputs
    };
}
