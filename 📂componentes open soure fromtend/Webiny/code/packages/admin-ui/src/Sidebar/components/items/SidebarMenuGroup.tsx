import React from "react";
import { SidebarMenuItem, type SidebarMenuItemGroupProps } from "./SidebarMenuItem.js";
import { makeDecoratable, withStaticProps } from "~/utils.js";
import {
    SidebarMenuItemIcon,
    type SidebarMenuItemIconProps
} from "~/Sidebar/components/items/SidebarMenuItemIcon.js";
import {
    SidebarMenuItemAction,
    type SidebarMenuItemActionProps
} from "~/Sidebar/components/items/SidebarMenuItemAction.js";

const SidebarMenuGroupBase = (props: SidebarMenuItemGroupProps) => {
    return <SidebarMenuItem variant={"group-label"} {...props} />;
};

const DecoratableSidebarMenuGroup = makeDecoratable("SidebarMenuGroup", SidebarMenuGroupBase);

const SidebarMenuGroup = withStaticProps(DecoratableSidebarMenuGroup, {
    Icon: SidebarMenuItemIcon,
    Action: SidebarMenuItemAction
});

export {
    SidebarMenuGroup,
    type SidebarMenuItemGroupProps,
    type SidebarMenuItemIconProps,
    type SidebarMenuItemActionProps
};
