import React from "react";
import { DropdownMenu } from "@webiny/admin-ui";
import { UserMenuSeparatorRenderer } from "@webiny/app-admin";

export const UserMenuSeparator = UserMenuSeparatorRenderer.createDecorator(() => {
    return function UserMenuSeparatorRenderer(props) {
        return <DropdownMenu.Separator variant={"dimmed"} {...props} />;
    };
});
