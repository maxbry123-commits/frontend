import * as React from "react";
import { Separator, type SeparatorProps } from "~/Separator/index.js";
import { makeDecoratable } from "~/utils.js";

type DropdownMenuSeparatorProps = SeparatorProps;

const DropdownMenuSeparatorBase = (props: DropdownMenuSeparatorProps) => {
    return <Separator variant={"strong"} margin={"md"} {...props} />;
};

const DropdownMenuSeparator = makeDecoratable("DropdownMenuSeparator", DropdownMenuSeparatorBase);

export { DropdownMenuSeparator, type DropdownMenuSeparatorProps };
