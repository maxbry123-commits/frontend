import React from "react";

import { Bind } from "@webiny/form";
import { Switch } from "@webiny/admin-ui";
import { Operation } from "~/components/AdvancedSearch/domain/index.js";

interface OperationSelectorProps {
    label: string;
    name: string;
}

export const OperationSelector = ({ label, name }: OperationSelectorProps) => {
    const getValue = (value: Operation): boolean => {
        return value === Operation.AND;
    };

    const setValue = (value: boolean): Operation => {
        if (value) {
            return Operation.AND;
        } else {
            return Operation.OR;
        }
    };

    return (
        <Bind name={name}>
            {({ value, onChange }) => (
                <Switch
                    label={label}
                    checked={getValue(value)}
                    onChange={value => onChange(setValue(value))}
                />
            )}
        </Bind>
    );
};
