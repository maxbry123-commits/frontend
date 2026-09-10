import { useEffect } from "react";
import { useDocumentEditor } from "~/DocumentEditor/index.js";
import { Commands } from "../commands.js";
import { $deselectElement } from "~/editorSdk/utils/index.js";

export const DeselectElement = () => {
    const editor = useDocumentEditor();
    useEffect(() => {
        return editor.registerCommandHandler(Commands.DeselectElement, () => {
            $deselectElement(editor);
        });
    }, []);

    return null;
};
