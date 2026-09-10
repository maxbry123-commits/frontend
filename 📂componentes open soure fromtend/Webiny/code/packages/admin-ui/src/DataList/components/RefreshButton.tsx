import React from "react";
import { RefreshIcon } from "../DataListIcons.js";
import type { DataListProps } from "../types.js";
import { Tooltip } from "~/Tooltip/index.js";

const RefreshButton = (props: DataListProps) => {
    const refresh = props.refresh;
    if (!refresh) {
        return null;
    }

    return (
        <Tooltip
            trigger={<RefreshIcon onClick={() => refresh()} size={"sm"} />}
            content={"Refresh list"}
        />
    );
};

export { RefreshButton };
