import React from "react";
import { makeDecoratable } from "@webiny/react-composition";
import type { ElementProps } from "./Element.js";
import { Element } from "./Element.js";
import { Elements } from "./Elements.js";
import { IconButton } from "./IconButton.js";

const getElementId = (value: string) => {
    return ["elementAction", value].join(":");
};

export type ElementActionProps = Omit<ElementProps, "scope" | "group" | "id">;

const BaseElementAction = makeDecoratable("ElementAction", (props: ElementActionProps) => {
    return (
        <Element
            {...props}
            scope={"elementActions"}
            id={getElementId(props.name)}
            before={props.before ? getElementId(props.before) : undefined}
            after={props.after ? getElementId(props.after) : undefined}
        />
    );
});

export const ElementActions = makeDecoratable("ElementActions", () => {
    return <Elements scope={"elementActions"} />;
});

export const ElementAction = Object.assign(BaseElementAction, { IconButton });
