import React from "react";

import { Bind } from "@webiny/form";
import { useInputField } from "~/components/index.js";
import { Select } from "@webiny/admin-ui";

export const PredefinedValues = () => {
    const { name, field } = useInputField();

    return (
        <Bind name={name}>
            {({ value, onChange, validation }) => (
                <Select
                    label={"Values"}
                    options={field.predefined.map(field => ({
                        label: field.label,
                        value: field.value
                    }))}
                    value={value}
                    onChange={data => onChange(data)}
                    validation={validation}
                    size={"lg"}
                />
            )}
        </Bind>
    );
};
