import type React from "react";

export interface BaseMenuItemProps {
    label: string;
    icon?: React.ReactNode;
    action?: React.ReactNode;
    children?: React.ReactNode;
}
