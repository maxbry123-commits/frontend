import type { ThemeStyleValue } from "~/types.js";

type StylesInput = {
    styleId?: string;
    styles?: ThemeStyleValue[];
};

/**
 * In older versions, we used to have styles as an array of objects. We must handle that
 * scenario to not break content for older projects.
 */
export const getStyleId = (input: StylesInput) => {
    if (input.styleId) {
        return input.styleId;
    }

    const styles = input.styles ?? [];
    const style = styles.find(x => x.type === "typography");

    return style?.styleId || undefined;
};
