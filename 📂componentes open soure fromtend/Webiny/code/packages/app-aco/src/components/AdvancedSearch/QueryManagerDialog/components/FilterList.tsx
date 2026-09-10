import React from "react";
import { List, IconButton, Tooltip, DropdownMenu } from "@webiny/admin-ui";
import { ReactComponent as SavedSearchIcon } from "@webiny/icons/saved_search.svg";
import { ReactComponent as MoreIcon } from "@webiny/icons/more_vert.svg";
import type { QueryManagerFilter } from "../QueryManagerDialog.js";
import { Description } from "./Description.js";

type filterCallback = (filterId: string) => void;

interface FilterListProps {
    onEdit: filterCallback;
    onRename: filterCallback;
    onDelete: filterCallback;
    onSelect: filterCallback;
    onClone: filterCallback;
    filters: QueryManagerFilter[];
}

export const FilterList = (props: FilterListProps) => {
    return (
        <List>
            {props.filters.map(filter => (
                <List.Item
                    key={filter.id}
                    onClick={() => props.onSelect(filter.id)}
                    title={filter.name}
                    description={
                        <Description createdOn={filter.createdOn}>{filter.description}</Description>
                    }
                    actions={
                        <>
                            <Tooltip
                                trigger={
                                    <IconButton
                                        icon={<SavedSearchIcon />}
                                        onClick={() => props.onSelect(filter.id)}
                                        size={"sm"}
                                        variant={"ghost"}
                                    />
                                }
                                content={"Apply filter"}
                                side={"left"}
                            />
                            <DropdownMenu
                                trigger={
                                    <IconButton icon={<MoreIcon />} size={"sm"} variant={"ghost"} />
                                }
                            >
                                <DropdownMenu.Item
                                    onClick={() => props.onEdit(filter.id)}
                                    text={"Edit"}
                                />
                                <DropdownMenu.Item
                                    onClick={() => props.onRename(filter.id)}
                                    text={"Rename"}
                                />
                                <DropdownMenu.Item
                                    onClick={() => props.onClone(filter.id)}
                                    text={"Clone"}
                                />
                                <DropdownMenu.Item
                                    onClick={() => props.onDelete(filter.id)}
                                    text={"Delete"}
                                />
                            </DropdownMenu>
                        </>
                    }
                />
            ))}
        </List>
    );
};
