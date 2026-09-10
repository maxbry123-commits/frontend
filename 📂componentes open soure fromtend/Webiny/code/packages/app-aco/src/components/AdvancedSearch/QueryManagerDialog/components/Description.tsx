import React from "react";
import { Text } from "@webiny/admin-ui";
import { TimeAgo } from "@webiny/admin-ui";

export interface DescriptionProps {
    children?: string;
    createdOn: string;
}

export const Description = (props: DescriptionProps) => {
    return (
        <Text size={"sm"}>
            {"Created"} <TimeAgo datetime={props.createdOn} />
            {props.children && ` - ${props.children}`}
        </Text>
    );
};
