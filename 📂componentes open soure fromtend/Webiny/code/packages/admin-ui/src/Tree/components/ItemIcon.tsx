import React from "react";
import { Icon, type IconProps } from "~/Icon/index.js";
import { makeDecoratable } from "~/utils.js";

interface ItemIconProps extends Omit<IconProps, "icon"> {
    element?: React.ReactNode;
    active?: boolean;
}

const BaseItemIcon = ({ element, active, ...props }: ItemIconProps) => {
    return (
        <Icon
            icon={element}
            size={"sm"}
            color={active ? "neutral-strong" : "neutral-light"}
            {...props}
        />
    );
};

const ItemIcon = makeDecoratable("TreeItemIcon", BaseItemIcon);

export { ItemIcon, type ItemIconProps };
