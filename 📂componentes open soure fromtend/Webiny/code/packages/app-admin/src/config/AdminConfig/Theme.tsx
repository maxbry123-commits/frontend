import React from "react";
import { assignColor } from "./Theme/assignColor.js";
import type { ColorPalette, ColorShade } from "./Theme/types.js";

export interface ThemeColorProps {
    palette: ColorPalette;
    color: string;
    shade?: ColorShade;
}

export const Color = React.memo(({ palette, color, shade }: ThemeColorProps) => {
    assignColor(palette, color, shade);
    return null;
});

Color.displayName = "Color";

export interface ThemeProps {
    children: React.ReactNode;
}

const ThemeBase = React.memo(({ children }: ThemeProps) => {
    return <>{children}</>;
});

ThemeBase.displayName = "Theme";

export const Theme = Object.assign(ThemeBase, {
    Color
});
