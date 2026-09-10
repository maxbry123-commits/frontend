import { useEffect } from "react";
import { useDocumentEditor } from "~/DocumentEditor/index.js";
import { Commands } from "../commands.js";
import { $selectElement } from "~/editorSdk/utils/index.js";

export const SelectElement = () => {
    const editor = useDocumentEditor();
    useEffect(() => {
        return editor.registerCommandHandler(Commands.SelectElement, ({ id }) => {
            $selectElement(editor, id);
        });
    }, []);

    return null;
};
