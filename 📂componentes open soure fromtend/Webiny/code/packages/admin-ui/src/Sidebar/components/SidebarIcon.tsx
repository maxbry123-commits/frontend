import React from "react";
import { Icon, type IconProps } from "~/Icon/index.js";
import { makeDecoratable } from "@webiny/react-composition";

interface SidebarIconProps extends Omit<IconProps, "icon"> {
    element?: React.ReactNode;
}

const SidebarIconBase = ({ element, ...props }: SidebarIconProps) => {
    return <Icon icon={element} size={"lg"} {...props} />;
};

const SidebarIcon = makeDecoratable("SidebarIcon", SidebarIconBase);

export { SidebarIcon, type SidebarIconProps };
