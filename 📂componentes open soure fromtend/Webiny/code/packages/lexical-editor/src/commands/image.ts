import type { LexicalCommand, NodeKey } from "lexical";
import { createCommand } from "lexical";
import type { ImageNodeProps } from "@webiny/lexical-nodes";

export interface ImagePayload extends ImageNodeProps {
    key?: NodeKey;
}

export const INSERT_IMAGE_COMMAND: LexicalCommand<ImagePayload> =
    createCommand("INSERT_IMAGE_COMMAND");
