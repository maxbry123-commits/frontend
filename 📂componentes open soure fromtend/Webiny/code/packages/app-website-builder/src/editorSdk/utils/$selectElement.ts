import type { Editor } from "../Editor.js";

export function $selectElement(editor: Editor, id: string | null) {
    editor.updateEditor(state => {
        state.selectedElement = id;
    });
}
