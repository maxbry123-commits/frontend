import React from "react";
import { useEffect } from "react";
import { useForm } from "~/FormContext.js";

export const UnsetOnUnmount = ({ name, children }: { name: string; children: React.ReactNode }) => {
    const form = useForm();

    useEffect(() => {
        return () => {
            form.setValue(name, undefined);
        };
    }, []);

    return <>{children}</>;
};
