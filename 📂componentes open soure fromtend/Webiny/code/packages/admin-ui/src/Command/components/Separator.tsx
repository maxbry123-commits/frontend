import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { Separator as SeparatorPrimitive } from "~/Separator/index.js";

type SeparatorProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>;

const Separator = (props: SeparatorProps) => (
    <CommandPrimitive.Separator {...props}>
        <SeparatorPrimitive variant={"strong"} margin={"md"} />
    </CommandPrimitive.Separator>
);

export { Separator, type SeparatorProps };
