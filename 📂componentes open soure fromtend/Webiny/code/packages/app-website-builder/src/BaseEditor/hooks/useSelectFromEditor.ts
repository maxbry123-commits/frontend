import deepEqual from "deep-equal";
import { useDocumentEditor } from "~/DocumentEditor/index.js";
import type { EditorState } from "~/editorSdk/Editor.js";
import { useSelectFromState } from "~/BaseEditor/hooks/useSelectFromState.js";

type Equals<T> = (a: T, b: T) => boolean;

/**
 * Subscribe to part of the document state.
 * @param selector   Pick the slice of state you care about.
 * @param equals     (optional) comparator, defaults to Object.is
 */
export function useSelectFromEditor<T>(
    selector: (doc: EditorState) => T,
    deps: React.DependencyList = [],
    equals: Equals<T> = deepEqual
): T {
    const editor = useDocumentEditor();

    return useSelectFromState(
        () => editor.getEditorState().read(),
        selector,
        [editor, ...deps],
        equals
    );
}
