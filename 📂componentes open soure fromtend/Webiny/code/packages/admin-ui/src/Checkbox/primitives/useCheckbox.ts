import { useEffect, useMemo, useState } from "react";
import { autorun } from "mobx";
import type { CheckboxPrimitiveProps } from "./CheckboxPrimitive.js";
import type { CheckboxPresenterParams } from "./presenters/CheckboxPresenter.js";
import { CheckboxPresenter } from "./presenters/CheckboxPresenter.js";

export const useCheckbox = (props: CheckboxPrimitiveProps) => {
    const params: CheckboxPresenterParams = useMemo(
        () => ({
            id: props.id,
            label: props.label,
            value: props.value,
            checked: props.checked,
            indeterminate: props.indeterminate,
            disabled: props.disabled,
            onCheckedChange: props.onChange
        }),
        [
            props.id,
            props.label,
            props.value,
            props.checked,
            props.indeterminate,
            props.disabled,
            props.onChange
        ]
    );
    const presenter = useMemo(() => {
        const presenter = new CheckboxPresenter();
        presenter.init(params);
        return presenter;
    }, []);

    const [vm, setVm] = useState(presenter.vm);

    useEffect(() => {
        presenter.init(params);
    }, [params]);

    useEffect(() => {
        return autorun(() => {
            setVm(presenter.vm);
        });
    }, [presenter]);

    return { vm, changeChecked: presenter.changeChecked };
};
