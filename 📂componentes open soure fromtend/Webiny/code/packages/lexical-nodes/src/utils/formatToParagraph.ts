import type { LexicalEditor } from "lexical";
import { $getSelection, $isRangeSelection } from "lexical";
import { $setBlocksType } from "@lexical/selection";
import { $createParagraphNode } from "~/ParagraphNode.js";

export const formatToParagraph = (editor: LexicalEditor, typographyStyleId?: string) => {
    editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createParagraphNode(typographyStyleId));
        }
    });
};
