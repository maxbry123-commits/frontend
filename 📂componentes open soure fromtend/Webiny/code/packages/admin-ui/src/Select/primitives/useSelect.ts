import { useEffect, useMemo, useState } from "react";
import { autorun } from "mobx";
import type { SelectPresenterParams } from "./presenters/SelectPresenter.js";
import { SelectPresenter } from "./presenters/SelectPresenter.js";
import type { SelectPrimitiveProps } from "./SelectPrimitive.js";

export const useSelect = (props: SelectPrimitiveProps) => {
    const params: SelectPresenterParams = useMemo(
        () => ({
            options: props.options,
            value: props.value,
            placeholder: props.placeholder,
            displayResetAction: props.displayResetAction,
            onValueChange: props.onChange,
            onValueReset: props.onValueReset
        }),
        [
            props.options,
            props.value,
            props.placeholder,
            props.displayResetAction,
            props.onChange,
            props.onValueReset
        ]
    );

    const presenter = useMemo(() => {
        return new SelectPresenter();
    }, []);

    const [vm, setVm] = useState(presenter.vm);

    useEffect(() => {
        presenter.init(params);
    }, [params, presenter]);

    useEffect(() => {
        return autorun(() => {
            setVm(presenter.vm);
        });
    }, [presenter]);

    return {
        vm,
        changeValue: presenter.changeValue,
        resetValue: presenter.resetValue
    };
};
