import React from "react";
import { Grid } from "@webiny/admin-ui";
import type { InputAstNode } from "@webiny/website-builder-sdk";
import { InputField } from "./InputField.js";
import type { DocumentElement, DocumentElementBindings } from "@webiny/website-builder-sdk";
import { useActiveElement } from "~/BaseEditor/hooks/useActiveElement.js";

export const InputRenderer = ({
    ast,
    bindings
}: {
    ast: InputAstNode[];
    bindings: DocumentElementBindings["inputs"];
}) => {
    return (
        <>
            {ast.map(node =>
                node.input.hideFromUi ? null : (
                    <Grid.Column span={12} key={node.path}>
                        <ActiveElement>
                            {element => (
                                <InputField
                                    key={node.path}
                                    element={element}
                                    node={node}
                                    bindings={bindings}
                                />
                            )}
                        </ActiveElement>
                    </Grid.Column>
                )
            )}
        </>
    );
};

type ActiveElementProps = {
    children: (element: DocumentElement) => React.ReactNode;
};

const ActiveElement = ({ children }: ActiveElementProps) => {
    const [element] = useActiveElement();
    if (!element) {
        return null;
    }

    return children(element);
};
