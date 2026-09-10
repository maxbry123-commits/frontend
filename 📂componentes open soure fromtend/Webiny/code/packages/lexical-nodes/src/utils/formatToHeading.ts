import type { LexicalEditor } from "lexical";
import { $getSelection, $isRangeSelection } from "lexical";
import { $setBlocksType } from "@lexical/selection";
import type { HeadingTagType } from "@lexical/rich-text";
import { $createHeadingNode } from "~/HeadingNode.js";

/*
 * Will change the selected HTML tag to specified heading or h1-h6.
 * For example if the selection is p with content inside after formatting the root tag
 * will be h1 with heading 1 theme style and the same content inside.
 * */
export const formatToHeading = (
    editor: LexicalEditor,
    tag: HeadingTagType,
    typographyStyleId?: string
) => {
    editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createHeadingNode(tag, typographyStyleId));
        }
    });
};
