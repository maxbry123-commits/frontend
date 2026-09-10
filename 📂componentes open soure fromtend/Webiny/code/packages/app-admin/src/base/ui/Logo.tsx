import React from "react";
import { createVoidComponent, makeDecoratable } from "@webiny/app";

export const Logo = makeDecoratable("Logo", () => {
    return <LogoRenderer />;
});

export const LogoRenderer = makeDecoratable("LogoRenderer", createVoidComponent());
