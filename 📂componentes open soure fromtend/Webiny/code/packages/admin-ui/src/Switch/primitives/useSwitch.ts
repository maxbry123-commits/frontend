import { useEffect, useMemo, useState } from "react";
import { autorun } from "mobx";
import type { SwitchPrimitiveProps } from "./SwitchPrimitive.js";
import type { SwitchPresenterParams } from "./presenters/SwitchPresenter.js";
import { SwitchPresenter } from "./presenters/SwitchPresenter.js";

export const useSwitch = (props: SwitchPrimitiveProps) => {
    const params: SwitchPresenterParams = useMemo(
        () => ({
            id: props.id,
            label: props.label,
            value: props.value,
            checked: props.checked,
            disabled: props.disabled,
            onChange: props.onChange
        }),
        [props.id, props.label, props.value, props.checked, props.disabled, props.onChange]
    );

    const presenter = useMemo(() => {
        const presenter = new SwitchPresenter();
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
