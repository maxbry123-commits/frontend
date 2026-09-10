import React from "react";
import { useActiveElement } from "~/BaseEditor/hooks/useActiveElement.js";

export interface NoActiveElementProps {
    children?: React.ReactNode;
}

export const NoActiveElement = ({ children }: NoActiveElementProps) => {
    const [element] = useActiveElement();

    if (element) {
        return null;
    }

    return <>{children}</>;
};
