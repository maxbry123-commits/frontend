import React from "react";
import { DropdownMenu } from "~/DropdownMenu/index.js";
import { NextPageIcon, OptionsIcon, PreviousPageIcon } from "../DataListIcons.js";
import type { DataListProps } from "../types.js";
import { Tooltip } from "~/Tooltip/index.js";

const Pagination = (props: DataListProps) => {
    const { pagination } = props;
    if (!pagination) {
        return null;
    }

    return (
        <>
            {pagination.setNextPage && (
                <>
                    <Tooltip
                        trigger={
                            <PreviousPageIcon
                                onClick={() => {
                                    if (pagination.setPreviousPage && pagination.hasPreviousPage) {
                                        pagination.setPreviousPage();
                                    }
                                }}
                                size={"sm"}
                            />
                        }
                        content={"Previous page"}
                    />
                    <Tooltip
                        trigger={
                            <NextPageIcon
                                onClick={() => {
                                    if (pagination.setNextPage && pagination.hasNextPage) {
                                        pagination.setNextPage();
                                    }
                                }}
                                size={"sm"}
                            />
                        }
                        content={"Next page"}
                    />
                </>
            )}

            {Array.isArray(pagination.perPageOptions) && pagination.setPerPage && (
                <DropdownMenu
                    trigger={
                        <Tooltip
                            trigger={<OptionsIcon size={"sm"} />}
                            content={"Navigate to page"}
                        />
                    }
                >
                    {pagination.setPerPage &&
                        pagination.perPageOptions.map(perPage => (
                            <DropdownMenu.Item
                                key={perPage}
                                onClick={() =>
                                    pagination.setPerPage && pagination.setPerPage(perPage)
                                }
                                text={perPage}
                            />
                        ))}
                </DropdownMenu>
            )}
        </>
    );
};

export { Pagination };
