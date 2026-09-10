import React from "react";
import { DropdownMenuItem, type DropdownMenuItemLinkProps } from "./DropdownMenuItem.js";
import { makeDecoratable, withStaticProps } from "~/utils.js";
import { DropdownMenuItemIcon, type DropdownMenuItemIconProps } from "./DropdownMenuItemIcon.js";

export type DropdownMenuLinkProps = DropdownMenuItemLinkProps;

const DropdownMenuLinkBase = (props: DropdownMenuLinkProps) => {
    return <DropdownMenuItem {...props} />;
};

const DecoratableDropdownMenuLink = makeDecoratable("DropdownMenuLink", DropdownMenuLinkBase);

const DropdownMenuLink = withStaticProps(DecoratableDropdownMenuLink, {
    Icon: DropdownMenuItemIcon
});

export { DropdownMenuLink, type DropdownMenuItemLinkProps, type DropdownMenuItemIconProps };
