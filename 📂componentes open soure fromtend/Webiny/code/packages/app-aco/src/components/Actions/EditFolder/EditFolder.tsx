import React, { useCallback } from "react";
import { ReactComponent as Edit } from "@webiny/icons/edit.svg";

import { AcoConfig } from "~/config/index.js";
import { useEditDialog } from "~/dialogs/index.js";
import { useFolder } from "~/hooks/index.js";

export const EditFolder = () => {
    const { folder } = useFolder();
    const { showDialog } = useEditDialog();
    const { OptionsMenuItem } = AcoConfig.Folder.Action;

    const onAction = useCallback(() => {
        showDialog({
            folder
        });
    }, [folder]);

    if (!folder) {
        return null;
    }

    return (
        <OptionsMenuItem
            icon={<Edit />}
            label={"Edit"}
            onAction={onAction}
            data-testid={"aco.actions.folder.edit"}
        />
    );
};
