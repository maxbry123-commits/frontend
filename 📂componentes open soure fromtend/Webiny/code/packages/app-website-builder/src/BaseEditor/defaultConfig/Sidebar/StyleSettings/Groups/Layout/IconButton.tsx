import React from "react";
import {
    IconButton as BaseIconButton,
    Tooltip,
    type IconButtonProps as BaseIconButtonProps
} from "@webiny/admin-ui";

export type IconButtonProps = BaseIconButtonProps & {
    tooltip: React.ReactNode;
};

export const IconButton = ({ tooltip, ...props }: IconButtonProps) => {
    return (
        <Tooltip
            delay={200}
            side={"bottom"}
            trigger={
                <BaseIconButton
                    icon={props.icon}
                    size={props.size ?? "md"}
                    variant={props.variant}
                    onClick={props.onClick}
                />
            }
            content={tooltip}
        />
    );
};
