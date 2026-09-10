import React from "react";
import { DropdownMenu } from "@webiny/admin-ui";
import { UserMenuLinkRenderer, UserMenuLinkIconRenderer } from "@webiny/app-admin";

export const UserMenuLink = UserMenuLinkRenderer.createDecorator(() => {
    return function UserMenuLinkRenderer(props) {
        return <DropdownMenu.Link {...props} />;
    };
});

export const UserMenuLinkIcon = UserMenuLinkIconRenderer.createDecorator(() => {
    return function UserMenuLinkRenderer(props) {
        return <DropdownMenu.Link.Icon {...props} />;
    };
});
