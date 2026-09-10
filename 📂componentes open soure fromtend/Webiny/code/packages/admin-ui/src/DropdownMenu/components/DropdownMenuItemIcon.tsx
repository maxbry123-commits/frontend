import React from "react";
import { Icon, type IconProps } from "~/Icon/index.js";

interface DropdownMenuItemIconProps extends Omit<IconProps, "icon"> {
    element: React.ReactNode;
}

const DropdownMenuItemIcon = (props: DropdownMenuItemIconProps) => {
    return <Icon size={"sm"} color={"neutral-light"} icon={props.element} {...props} />;
};

export { DropdownMenuItemIcon, type DropdownMenuItemIconProps };
