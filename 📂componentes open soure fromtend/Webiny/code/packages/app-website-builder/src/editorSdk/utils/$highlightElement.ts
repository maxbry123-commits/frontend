import type { Editor } from "../Editor.js";

export function $highlightElement(editor: Editor, id: string | null) {
    editor.updateEditor(state => {
        state.highlightedElement = id;
    });
}
