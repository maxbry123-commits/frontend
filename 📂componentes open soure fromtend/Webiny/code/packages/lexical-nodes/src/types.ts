export type ThemeStyleType = "typography" | "colors" | "fonts";

export interface ThemeStyleValue {
    styleId: string;
    type: ThemeStyleType;
}

export interface TypographyStylesNode {
    getStyleId: () => string | undefined;
    setStyleId: (id: string) => void;
    getClassName: () => string | undefined;
    setClassName: (className: string) => void;
}
