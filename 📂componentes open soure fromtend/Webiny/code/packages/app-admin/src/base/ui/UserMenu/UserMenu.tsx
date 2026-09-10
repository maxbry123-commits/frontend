import React from "react";
import { createVoidComponent, makeDecoratable } from "@webiny/app";

export const UserMenu = makeDecoratable("UserMenu", () => {
    return <UserMenuRenderer />;
});

export const UserMenuRenderer = makeDecoratable("UserMenuRenderer", createVoidComponent());
