import { useMemo } from "react";
import { useSelectFromEditor } from "~/BaseEditor/hooks/useSelectFromEditor.js";
import { ElementFactory } from "@webiny/website-builder-sdk";

export const useElementFactory = () => {
    const components = useSelectFromEditor(state => {
        return state.components;
    });

    return useMemo(() => new ElementFactory(components), [components]);
};
