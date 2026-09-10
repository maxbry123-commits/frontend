import type { HTMLAttributeAnchorTarget } from "react";
import React from "react";
import { DropdownMenu } from "@webiny/admin-ui";

export interface OptionsMenuLinkProps {
    disabled?: boolean;
    icon: React.ReactElement;
    label: string;
    to: string;
    target?: HTMLAttributeAnchorTarget;
    ["data-testid"]?: string;
    className?: string;
}

export const OptionsMenuLink = (props: OptionsMenuLinkProps) => {
    return (
        <DropdownMenu.Link
            to={props.to}
            disabled={props.disabled}
            data-testid={props["data-testid"]}
            icon={<DropdownMenu.Item.Icon label={props.label} element={props.icon} />}
            text={props.label}
            className={props.className}
        />
    );
};
