import React from "react";
import type { ComponentPropsWithChildren } from "~/types.js";

export const GridColumnComponent = ({
    inputs
}: {
    inputs: ComponentPropsWithChildren["inputs"];
}) => {
    return <>{inputs.children}</>;
};
