import React from "react";
import { DialogContainer } from "./DialogContainer.js";

export interface DialogProviderProps {
    children?: React.ReactNode;
}

export const DialogProvider = (Component: React.ComponentType<DialogProviderProps>) => {
    return function DialogProviderProps({ children }: DialogProviderProps) {
        return (
            <Component>
                {children}
                <DialogContainer />
            </Component>
        );
    };
};
