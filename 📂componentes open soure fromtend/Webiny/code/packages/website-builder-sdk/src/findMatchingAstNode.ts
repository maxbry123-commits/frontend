import type { InputAstNode } from "~/ComponentManifestToAstConverter.js";

export function findMatchingAstNode(path: string, ast: InputAstNode[]): InputAstNode | undefined {
    // Remove all array indices, e.g. columns[0].children → columns.children
    const cleanedPath = path.replace(/\[\d+\]/g, "");
    const pathParts = cleanedPath.split(".");

    let nodes = ast;
    let currentNode: InputAstNode | undefined;

    for (const part of pathParts) {
        currentNode = nodes.find(n => n.name === part);
        if (!currentNode) {
            return undefined;
        }

        nodes = currentNode.children;
    }

    return currentNode;
}
