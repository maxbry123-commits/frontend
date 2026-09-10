"use client";
import React from "react";
import { ElementRenderer } from "./ElementRenderer.js";
import type { ElementSlotProps } from "./ElementSlot.js";
import { ElementSlotDepthProvider, useElementSlotDepth } from "./ElementSlotDepthProvider.js";
import { ElementIndexProvider } from "./ElementIndexProvider.js";

export const LiveElementSlot = ({ elements = [] }: Pick<ElementSlotProps, "elements">) => {
    const depth = useElementSlotDepth();
    return (
        <>
            <ElementSlotDepthProvider depth={depth + 1}>
                {elements.map((id, index) => (
                    <ElementIndexProvider key={id} index={index}>
                        <ElementRenderer id={id} />
                    </ElementIndexProvider>
                ))}
            </ElementSlotDepthProvider>
        </>
    );
};
