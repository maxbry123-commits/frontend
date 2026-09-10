import React from "react";
import { i18n } from "@webiny/app/i18n/index.js";
import { Text } from "@webiny/admin-ui";

const t = i18n.ns("app-aco/components/folder-tree/empty");

export const Empty = () => {
    return <Text size={"sm"}>{t`No folders found...`}</Text>;
};
