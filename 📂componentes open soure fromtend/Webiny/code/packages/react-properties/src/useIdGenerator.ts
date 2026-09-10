import { useCallback } from "react";
import { useParentProperty } from "~/Properties.js";

const keywords = ["$first", "$last"];

export function useIdGenerator(name: string) {
    const parentProperty = useParentProperty();

    return useCallback(
        (...parts: string[]) => {
            if (keywords.includes(parts[0])) {
                return parts[0];
            }
            return [parentProperty?.id, name, ...parts].filter(Boolean).join(":");
        },
        [name, parentProperty]
    );
}
