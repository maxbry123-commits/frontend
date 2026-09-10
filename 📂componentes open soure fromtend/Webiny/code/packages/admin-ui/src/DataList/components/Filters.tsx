import React from "react";
import { DropdownMenu } from "~/DropdownMenu/index.js";
import { FilterIcon } from "../DataListIcons.js";
import type { DataListProps } from "../types.js";

const Filters = (props: DataListProps) => {
    const filters = props.filters;
    if (!filters) {
        return null;
    }

    return <DropdownMenu trigger={<FilterIcon size={"sm"} />}>{filters}</DropdownMenu>;
};

export { Filters };
