import React from "react";
import { IconButton, Tooltip } from "@webiny/admin-ui";
import { ReactComponent as FilterIcon } from "@webiny/icons/filter_list.svg";
import { ReactComponent as CloseFilterIcon } from "@webiny/icons/filter_list_off.svg";

interface IconProps {
    showingFilters?: boolean;
}

const Icon = ({ showingFilters }: IconProps) => {
    return showingFilters ? <CloseFilterIcon /> : <FilterIcon />;
};
const IconComponent = React.memo(Icon);

export interface FiltersToggleProps {
    onFiltersToggle: () => void;
    showingFilters: boolean;
    "data-testid"?: string;
}

export const FiltersToggle = (props: FiltersToggleProps) => {
    return (
        <Tooltip
            side={"bottom"}
            content={props.showingFilters ? "Hide filters" : "Show filters"}
            trigger={
                <IconButton
                    variant={"ghost"}
                    icon={<IconComponent showingFilters={props.showingFilters} />}
                    onClick={props.onFiltersToggle}
                    data-testid={props["data-testid"]}
                />
            }
        />
    );
};
