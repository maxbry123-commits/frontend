import type { LexicalCommand, LexicalEditor, NodeKey } from "lexical";
import { createCommand } from "lexical";
import type { TypographyValue } from "@webiny/lexical-theme";

export const ADD_TYPOGRAPHY_COMMAND: LexicalCommand<TypographyPayload> =
    createCommand("ADD_TYPOGRAPHY_COMMAND");

export interface TypographyPayload {
    value: TypographyValue;
    caption?: LexicalEditor;
    key?: NodeKey;
}
