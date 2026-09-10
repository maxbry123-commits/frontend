import React from "react";
import { makeDecoratable, useButtons } from "@webiny/app-admin";
import type { BaseActionProps } from "./BaseAction.js";
import { BaseAction } from "./BaseAction.js";

export type ButtonActionType = "button-action";
export type ButtonActionProps = Omit<BaseActionProps, "$type">;

export const BaseButtonAction = makeDecoratable("ButtonAction", (props: ButtonActionProps) => {
    return <BaseAction {...props} $type={"button-action"} />;
});

export const ButtonAction = Object.assign(BaseButtonAction, { useButtons });
