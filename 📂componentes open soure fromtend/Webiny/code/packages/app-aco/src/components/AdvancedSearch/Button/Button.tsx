import React from "react";
import { Button as UIButton, Icon } from "@webiny/admin-ui";
import { ReactComponent as SettingsIcon } from "@webiny/icons/tune.svg";

export interface ButtonProps {
    onClick: () => void;
}

export const Button = ({ onClick }: ButtonProps) => {
    return (
        <UIButton
            onClick={onClick}
            text={"Advanced search filter"}
            icon={<Icon label={"Advanced search filter"} icon={<SettingsIcon />} />}
            variant={"secondary"}
        />
    );
};
