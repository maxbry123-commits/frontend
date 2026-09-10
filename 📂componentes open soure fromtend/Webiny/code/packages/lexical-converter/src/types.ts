import type { CreateEditorArgs, LexicalNode } from "lexical";

export type NodeMapper = (node: LexicalNode) => LexicalNode;

export interface ParserConfigurationOptions {
    editorConfig?: Pick<CreateEditorArgs, "nodes" | "theme">;
    nodeMapper?: NodeMapper;
}
