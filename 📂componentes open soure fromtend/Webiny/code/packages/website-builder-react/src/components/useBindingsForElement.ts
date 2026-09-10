import { toJS } from "mobx";
import { BindingsProcessor } from "@webiny/website-builder-sdk";
import { useViewport } from "./useViewportInfo.js";
import { useDocumentStore } from "./DocumentStoreProvider.js";
import { useSelectFromState } from "./useSelectFromState.js";

export const useBindingsForElement = (elementId: string, breakpoint: string) => {
    const documentStore = useDocumentStore();
    const viewport = useViewport();

    return useSelectFromState(
        () => documentStore.getDocument()!,
        document => {
            const bindings = toJS(document.bindings[elementId]) ?? {};
            const breakpoints = viewport.breakpoints.map(bp => bp.name);

            // Merge element bindings.
            const bindingsProcessor = new BindingsProcessor(breakpoints);

            return bindingsProcessor.getBindings(bindings, breakpoint);
        },
        [elementId, breakpoint]
    );
};
