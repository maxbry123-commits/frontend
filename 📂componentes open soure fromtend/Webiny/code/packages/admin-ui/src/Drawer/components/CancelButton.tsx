import * as React from "react";
import { makeDecoratable } from "~/utils.js";
import { DrawerClose } from "./DrawerClose.js";
import type { ButtonProps } from "~/Button/index.js";
import { Button } from "~/Button/index.js";

const CancelButtonBase = (props: ButtonProps) => (
    <DrawerClose asChild>
        <Button text={"Cancel"} {...props} variant="secondary" />
    </DrawerClose>
);

export const CancelButton = makeDecoratable("CancelButton", CancelButtonBase);
