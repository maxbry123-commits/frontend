import { TextAlignmentAction } from "@webiny/lexical-editor";
import React from "react";
import { LexicalColorPickerDropdown } from "~/components/LexicalColorPickerDropdown.js";
import { FontColorAction } from "@webiny/lexical-editor";
import { TextAlignmentDropdown } from "~/components/TextAlignmentDropdown.js";

/*
 * Lexical editor configuration and components with global composition scope
 */
export const LexicalEditorActions = () => {
    return (
        <>
            <FontColorAction.ColorPicker element={<LexicalColorPickerDropdown />} />
            <TextAlignmentAction.TextAlignmentDropDown element={<TextAlignmentDropdown />} />
        </>
    );
};
