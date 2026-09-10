import React from "react";
import styled from "@emotion/styled";
import { EditorConfig } from "~/BaseEditor/index.js";

// TODO: find a good place for this!
export const COLORS = {
    lightGray: "hsla(0, 0%, 97%, 1)",
    gray: "hsla(300, 2%, 92%, 1)",
    darkGray: "hsla(0, 0%, 70%, 1)",
    darkestGray: "hsla(0, 0%, 20%, 1)",
    black: "hsla(208, 100%, 5%, 1)"
};

const SidebarActions = styled("div")({
    display: "flex",
    flexWrap: "wrap",
    borderBottom: `1px solid ${COLORS.gray}`,
    backgroundColor: COLORS.lightGray,
    borderTop: `1px solid ${COLORS.gray}`,
    justifyContent: "center"
});

export const ElementActions = () => {
    return (
        <SidebarActions>
            <EditorConfig.ElementActions />
        </SidebarActions>
    );
};
