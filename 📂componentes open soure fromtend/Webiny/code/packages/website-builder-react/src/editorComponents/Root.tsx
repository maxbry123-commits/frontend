import React from "react";
import type { ComponentPropsWithChildren } from "~/types.js";

export const RootComponent = ({ inputs }: ComponentPropsWithChildren) => {
    return <>{inputs.children}</>;
};
