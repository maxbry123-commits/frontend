import { useEffect } from "react";
import { useDocumentEditor } from "~/DocumentEditor/index.js";
import { Commands } from "../commands.js";
import { $highlightElement } from "~/editorSdk/utils/index.js";

export const HighlightElement = () => {
    const editor = useDocumentEditor();
    useEffect(() => {
        return editor.registerCommandHandler(Commands.HighlightElement, ({ id }) => {
            $highlightElement(editor, id);
        });
    }, []);

    return null;
};
