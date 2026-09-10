import React from "react";
import { DropdownMenu } from "@webiny/admin-ui";
import { UserMenuItemRenderer, UserMenuItemIconRenderer } from "@webiny/app-admin";

export const UserMenuItem = UserMenuItemRenderer.createDecorator(() => {
    return function UserMenuItemRenderer(props) {
        return <DropdownMenu.Item {...props} />;
    };
});

export const UserMenuItemIcon = UserMenuItemIconRenderer.createDecorator(() => {
    return function UserMenuItemRenderer(props) {
        return <DropdownMenu.Item.Icon {...props} />;
    };
});
