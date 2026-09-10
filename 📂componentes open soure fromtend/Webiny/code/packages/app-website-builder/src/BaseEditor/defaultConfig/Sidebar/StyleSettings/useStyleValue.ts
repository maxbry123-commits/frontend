import { useCallback } from "react";
import { useStyles } from "./useStyles.js";
import { UnitValue } from "./UnitValue.js";

export const useStyleValue = (elementId: string, propertyName: string, defaultValue?: string) => {
    const { styles, onChange, onPreviewChange, inheritanceMap, store } = useStyles(elementId);
    const unitValue = UnitValue.from(styles[propertyName] ?? defaultValue ?? "");

    const { overridden, inheritedFrom } = inheritanceMap[propertyName] ?? {};

    const onValueChange = useCallback(
        (value: string) => {
            onChange(({ styles }) => {
                styles.set(propertyName, value);
            });
        },
        [elementId, propertyName]
    );

    const onValueChangePreview = useCallback(
        (value: string) => {
            onPreviewChange(({ styles }) => {
                styles.set(propertyName, value);
            });
        },
        [elementId, propertyName]
    );

    const onValueReset = useCallback(() => {
        onChange(({ styles }) => {
            styles.unset(propertyName);
        });
    }, [elementId, propertyName]);

    return {
        store,
        value: unitValue.getValue(),
        unit: unitValue.getUnit(),
        isKeyword: unitValue.isKeyword(),
        onChange: onValueChange,
        onChangePreview: onValueChangePreview,
        onReset: onValueReset,
        inheritedFrom,
        overridden
    };
};
