import type { Editor } from "../Editor.js";

export function $getActiveElementId(editor: Editor) {
    return editor.getEditorState().read().selectedElement;
}
