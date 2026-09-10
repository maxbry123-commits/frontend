import React from "react";
import { Property } from "@webiny/react-properties";
import { IsApplicableToCurrentModel } from "~/admin/config/IsApplicableToCurrentModel.js";

export interface WidthProps {
    value: string;
    modelIds?: string[];
}

export const Width = ({ value, modelIds = [] }: WidthProps) => {
    return (
        <IsApplicableToCurrentModel modelIds={modelIds}>
            <Property id={`contentEntryForm:width`} name={"width"} value={value} />
        </IsApplicableToCurrentModel>
    );
};
