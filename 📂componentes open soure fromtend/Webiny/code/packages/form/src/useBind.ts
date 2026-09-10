import { useEffect, useMemo } from "react";
import { makeDecoratable } from "@webiny/react-composition";
import type { BindComponentProps, UseBindHook } from "~/types.js";
import { useBindPrefix } from "~/BindPrefix.js";
import { useForm } from "./FormContext.js";

export type UseBind = (props: BindComponentProps) => UseBindHook;

export const useBind = makeDecoratable((props: BindComponentProps): UseBindHook => {
    const form = useForm();
    const bindPrefix = useBindPrefix();

    const bindName = useMemo(() => {
        return [bindPrefix, props.name].filter(Boolean).join(".");
    }, [props.name]);

    const fieldProps = { ...props, name: bindName };

    useEffect(() => {
        form.registerField(fieldProps);

        return () => {
            form.unregisterField(fieldProps.name);
        };
    }, []);

    return form.registerField(fieldProps);
});
