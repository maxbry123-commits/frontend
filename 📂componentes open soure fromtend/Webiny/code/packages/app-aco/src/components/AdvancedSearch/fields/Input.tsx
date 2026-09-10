import React from "react";

import { Bind } from "@webiny/form";
import { Input as UiInput } from "@webiny/admin-ui";
import { useInputField } from "~/components/index.js";

export const Input = () => {
    const { name, field } = useInputField();

    return (
        <Bind name={name}>
            <UiInput label={"Value"} type={field.type} size={"lg"} />
        </Bind>
    );
};
