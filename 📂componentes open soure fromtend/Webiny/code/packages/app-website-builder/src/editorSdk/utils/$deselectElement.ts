import type { Editor } from "../Editor.js";

export function $deselectElement(editor: Editor) {
    editor.updateEditor(state => {
        state.selectedElement = null;
    });
}
