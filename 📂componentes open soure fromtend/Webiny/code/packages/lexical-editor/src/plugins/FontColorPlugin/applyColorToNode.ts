import type { TextNode } from "lexical";
import type { ThemeColorValue } from "@webiny/lexical-nodes";
import { $applyStylesToNode, $createFontColorNode } from "@webiny/lexical-nodes";

export function applyColorToNode(textNode: TextNode, color: ThemeColorValue) {
    const fontColorNode = $createFontColorNode(textNode.getTextContent(), color);
    $applyStylesToNode(fontColorNode, textNode);

    return textNode.replace(fontColorNode);
}
