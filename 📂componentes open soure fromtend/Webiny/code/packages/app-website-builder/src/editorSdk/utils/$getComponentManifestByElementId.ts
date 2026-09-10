import type { Editor } from "../Editor.js";
import type { ComponentManifest } from "@webiny/website-builder-sdk";

export function $getComponentManifestByElementId(
    editor: Editor,
    id: string
): ComponentManifest | undefined {
    const document = editor.getDocumentState().read();
    const editorState = editor.getEditorState().read();

    if (!document.elements[id]) {
        return undefined;
    }

    const componentName = document.elements[id].component.name;
    return editorState.components[componentName];
}
