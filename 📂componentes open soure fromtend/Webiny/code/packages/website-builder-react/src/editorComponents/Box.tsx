import React from "react";
import type { ComponentPropsWithChildren } from "~/types.js";

export const BoxComponent = ({ inputs }: ComponentPropsWithChildren) => {
    return <>{inputs.children}</>;
};
