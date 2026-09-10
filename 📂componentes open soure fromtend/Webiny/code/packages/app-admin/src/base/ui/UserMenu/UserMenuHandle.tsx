import React from "react";
import { createVoidComponent, makeDecoratable } from "@webiny/app";

export const UserMenuHandle = makeDecoratable("UserMenuHandle", () => {
    return <UserMenuHandleRenderer />;
});

export const UserMenuHandleRenderer = makeDecoratable(
    "UserMenuHandleRenderer",
    createVoidComponent()
);
