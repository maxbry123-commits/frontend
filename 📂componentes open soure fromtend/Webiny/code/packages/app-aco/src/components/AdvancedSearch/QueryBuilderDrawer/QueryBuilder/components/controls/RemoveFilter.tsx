import React from "react";
import { ReactComponent as DeleteIcon } from "@webiny/icons/delete.svg";
import { IconButton, Tooltip } from "@webiny/admin-ui";

interface RemoveFilterProps {
    onClick: () => void;
    disabled: boolean;
}

export const RemoveFilter = ({ onClick, disabled }: RemoveFilterProps) => {
    return (
        <Tooltip
            content={"Remove filter"}
            side={"bottom"}
            trigger={
                <IconButton
                    icon={<DeleteIcon />}
                    onClick={onClick}
                    variant={"ghost"}
                    size={"lg"}
                    disabled={disabled}
                />
            }
        />
    );
};
