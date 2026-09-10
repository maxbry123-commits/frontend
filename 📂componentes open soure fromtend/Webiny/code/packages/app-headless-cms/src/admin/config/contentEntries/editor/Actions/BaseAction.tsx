import React from "react";
import { Property, useIdGenerator } from "@webiny/react-properties";
import { IsApplicableToCurrentModel } from "~/admin/config/IsApplicableToCurrentModel.js";

export interface BaseActionConfig<T extends string> {
    name: string;
    element: React.ReactElement;
    $type: T;
}

export interface BaseActionProps {
    name: string;
    remove?: boolean;
    before?: string;
    after?: string;
    modelIds?: string[];
    element: React.ReactElement;
    $type: string;
}

export const BaseAction = ({
    name,
    after = undefined,
    before = undefined,
    remove = false,
    modelIds = [],
    element,
    $type
}: BaseActionProps) => {
    const getId = useIdGenerator("action");

    const placeAfter = after !== undefined ? getId(after) : undefined;
    const placeBefore = before !== undefined ? getId(before) : undefined;

    return (
        <IsApplicableToCurrentModel modelIds={modelIds}>
            <Property
                id={getId(name)}
                name={"actions"}
                remove={remove}
                array={true}
                before={placeBefore}
                after={placeAfter}
            >
                <Property id={getId(name, "name")} name={"name"} value={name} />
                <Property id={getId(name, "element")} name={"element"} value={element} />
                <Property id={getId(name, "$type")} name={"$type"} value={$type} />
            </Property>
        </IsApplicableToCurrentModel>
    );
};
