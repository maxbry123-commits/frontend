import React from "react";
import { UserMenu as BaseUserMenu } from "./UserMenu/UserMenu.js";
import { UserMenuHandle } from "./UserMenu/UserMenuHandle.js";
import { UserMenuItem, UserMenuItemIcon } from "./UserMenu/UserMenuItem.js";
import { UserMenuLink, UserMenuLinkIcon } from "./UserMenu/UserMenuLink.js";
import { UserMenuSeparator } from "./UserMenu/UserMenuSeparator.js";

export const UserMenu = () => {
    return (
        <>
            <UserMenuHandle />
            <BaseUserMenu />
            <UserMenuItem />
            <UserMenuItemIcon />
            <UserMenuLink />
            <UserMenuLinkIcon />
            <UserMenuSeparator />
        </>
    );
};
