import React from "react";
import { contentModelEditorContext } from "./ContentModelEditorProvider.js";

export function useModelEditor() {
    const context = React.useContext(contentModelEditorContext);
    if (!context) {
        throw new Error("useContentModelEditor must be used within a ContentModelEditorProvider");
    }

    return context;
}
