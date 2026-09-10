import type React from "react";

export interface BaseUserMenuItemProps {
    label: string;
    icon?: React.ReactNode;
    action?: React.ReactNode;
    children?: React.ReactNode;
}
