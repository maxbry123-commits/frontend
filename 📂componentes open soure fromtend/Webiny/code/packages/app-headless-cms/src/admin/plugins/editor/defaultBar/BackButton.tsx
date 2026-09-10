import React from "react";
import { useRouter } from "@webiny/app-admin";
import { ReactComponent as BackIcon } from "@webiny/icons/arrow_back.svg";
import { IconButton } from "@webiny/admin-ui";
import { Routes } from "~/routes.js";

const BackButton = React.memo(() => {
    const { goToRoute } = useRouter();

    return (
        <IconButton
            data-testid="cms-editor-back-button"
            onClick={() => goToRoute(Routes.ContentModels.List)}
            icon={<BackIcon />}
            variant="ghost"
        />
    );
});

BackButton.displayName = "BackButton";

export default BackButton;
