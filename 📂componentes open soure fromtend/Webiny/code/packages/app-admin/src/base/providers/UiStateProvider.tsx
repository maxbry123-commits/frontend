import React from "react";
import { UiProvider } from "@webiny/app/contexts/Ui/index.js";
import { createProvider } from "@webiny/app";

interface UiStateProviderProps {
    children: React.ReactNode;
}

export const createUiStateProvider = () => {
    return createProvider(Component => {
        return function UiStateProvider({ children }: UiStateProviderProps) {
            return (
                <UiProvider>
                    <Component>{children}</Component>
                </UiProvider>
            );
        };
    });
};
