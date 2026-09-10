import React from "react";
import { makeDecoratable } from "@webiny/react-composition";

export interface AppContentProps {
    children: React.ReactNode;
}

export const AppContainer = makeDecoratable("AppContainer", ({ children }: AppContentProps) => {
    return <>{children}</>;
});
