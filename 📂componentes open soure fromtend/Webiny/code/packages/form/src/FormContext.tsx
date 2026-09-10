import React, { useContext } from "react";
import type { FormAPI, GenericFormData } from "~/types.js";

export const FormContext = React.createContext<FormAPI | undefined>(undefined);

export const useForm = <T extends GenericFormData = GenericFormData>() => {
    const context = useContext(FormContext) as FormAPI<T>;
    if (!context) {
        throw new Error("Missing Form component in the component hierarchy!");
    }
    return context;
};
