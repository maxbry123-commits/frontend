import React, { Fragment } from "react";
import "./StaticToolbar.css";
import { useLexicalEditorConfig } from "~/components/LexicalEditorConfig/LexicalEditorConfig.js";
import { useRichTextEditor } from "~/hooks/index.js";

export const StaticToolbar = ({ className }: { className?: string }) => {
    const { toolbarElements } = useLexicalEditorConfig();
    const { editor } = useRichTextEditor();

    return (
        <div className={className ?? "static-toolbar"} data-role={"toolbar"}>
            {editor.isEditable() && (
                <>
                    {toolbarElements.map(action => (
                        <Fragment key={action.name}>{action.element}</Fragment>
                    ))}
                </>
            )}
        </div>
    );
};
