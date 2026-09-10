import { useContext } from "react";
import { FieldEditorContext } from "./FieldEditorContext.js";

export function useModelFieldEditor() {
    const context = useContext(FieldEditorContext);
    if (!context) {
        throw Error(
            `FieldEditorContext is missing in the component tree. Are you useing the "useFieldEditor()" hook in the right place?`
        );
    }

    return context;
}
