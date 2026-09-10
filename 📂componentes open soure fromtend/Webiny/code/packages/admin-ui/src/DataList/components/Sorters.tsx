import React from "react";
import { DropdownMenu } from "~/DropdownMenu/index.js";
import { SortIcon } from "../DataListIcons.js";
import type { DataListProps } from "../types.js";

const Sorters = (props: DataListProps) => {
    const sorters = props.sorters;
    if (!sorters) {
        return null;
    }

    return (
        <DropdownMenu trigger={<SortIcon size={"sm"} />}>
            {sorters.map(sorter => (
                <DropdownMenu.Item
                    key={sorter.label}
                    onClick={() => {
                        if (sorters && props.setSorters) {
                            props.setSorters(sorter.value);
                        }
                    }}
                    content={sorter.label}
                />
            ))}
        </DropdownMenu>
    );
};

export { Sorters };
