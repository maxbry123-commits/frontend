import React from "react";
import { createVoidComponent, makeDecoratable } from "@webiny/app";

export * from "./UserMenu/UserMenuItem.js";
export * from "./UserMenu/UserMenuLink.js";
export * from "./UserMenu/UserMenuSeparator.js";

// UserMenu
export const UserMenu = makeDecoratable("UserMenu", () => {
    return <UserMenuRenderer />;
});

export const UserMenuRenderer = makeDecoratable("UserMenuRenderer", createVoidComponent());

// UserMenuHandle
export const UserMenuHandle = makeDecoratable("UserMenuHandle", () => {
    return <UserMenuHandleRenderer />;
});

export const UserMenuHandleRenderer = makeDecoratable(
    "UserMenuHandleRenderer",
    createVoidComponent()
);
