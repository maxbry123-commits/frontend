import * as React from "react";
import { makeDecoratable } from "~/utils.js";
import type { IconProps as IconComponentProps } from "~/Icon/index.js";
import { Icon as IconComponent } from "~/Icon/index.js";

type ListItemIconProps = IconComponentProps;

const DecoratableListItemIcon = (props: ListItemIconProps) => {
    return <IconComponent size={"md"} color={"inherit"} {...props} />;
};

export const ListItemIcon = makeDecoratable("ListItemIcon", DecoratableListItemIcon);
