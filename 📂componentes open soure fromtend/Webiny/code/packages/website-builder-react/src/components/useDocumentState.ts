import { useDocumentStore } from "./DocumentStoreProvider.js";
import { useSelectFromState } from "./useSelectFromState.js";

export const useDocumentState = () => {
    const documentStore = useDocumentStore();
    return useSelectFromState(
        () => documentStore.getDocument()!,
        document => document.state ?? {}
    );
};
