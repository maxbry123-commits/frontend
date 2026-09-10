import * as React from "react";
import { ReactComponent as InfoIcon } from "@webiny/icons/info.svg";
import { Tooltip } from "~/Tooltip/index.js";
import { Icon } from "~/Icon/index.js";

interface LabelHintProps {
    content: React.ReactNode;
}

const LabelHint = ({ content }: LabelHintProps) => (
    <Tooltip
        content={content}
        trigger={
            <Icon
                icon={<InfoIcon />}
                size="xs"
                label={"More information"}
                color={"neutral-light"}
            />
        }
    />
);

export { LabelHint, type LabelHintProps };
