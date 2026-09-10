import * as React from "react";
import { makeDecoratable } from "~/utils.js";
import type { IconProps as IconComponentProps } from "~/Icon/index.js";
import { Icon as IconComponent } from "~/Icon/index.js";

type AccordionItemIconProps = IconComponentProps;

const AccordionItemIconBase = (props: AccordionItemIconProps) => {
    return <IconComponent size={"md"} color={"neutral-strong"} {...props} />;
};

export const AccordionItemIcon = makeDecoratable("AccordionItemIcon", AccordionItemIconBase);
