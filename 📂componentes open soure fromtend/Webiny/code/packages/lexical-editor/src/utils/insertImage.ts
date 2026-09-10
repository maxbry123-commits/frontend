import { $insertNodes, $isRootOrShadowRoot } from "lexical";
import { $wrapNodeInElement } from "@lexical/utils";
import { $createParagraphNode, $createImageNode } from "@webiny/lexical-nodes";
import type { InsertImagePayload } from "~/plugins/ImagesPlugin/ImagesPlugin.js";

/*
 * Insert image into editor.
 */
export const insertImage = (payload: InsertImagePayload): boolean => {
    const imageNode = $createImageNode(payload);
    $insertNodes([imageNode]);
    if ($isRootOrShadowRoot(imageNode.getParentOrThrow())) {
        $wrapNodeInElement(imageNode, $createParagraphNode).selectEnd();
    }
    return true;
};
