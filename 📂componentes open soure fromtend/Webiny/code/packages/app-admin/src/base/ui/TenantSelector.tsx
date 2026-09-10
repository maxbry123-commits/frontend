import React from "react";
import { createVoidComponent, makeDecoratable } from "@webiny/app";

export const TenantSelector = makeDecoratable("TenantSelector", () => {
    return <TenantSelectorRenderer />;
});

export const TenantSelectorRenderer = makeDecoratable(
    "TenantSelectorRenderer",
    createVoidComponent()
);
