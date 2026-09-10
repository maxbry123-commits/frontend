import { useEffect, useMemo, useState } from "react";
import { autorun } from "mobx";
import type { RadioGroupPrimitiveProps } from "./RadioGroupPrimitive.js";
import type { RadioGroupPresenterParams } from "./presenters/RadioGroupPresenter.js";
import { RadioGroupPresenter } from "./presenters/RadioGroupPresenter.js";

export const useRadioGroup = (props: RadioGroupPrimitiveProps) => {
    const params: RadioGroupPresenterParams = useMemo(
        () => ({
            items: props.items,
            onValueChange: props.onChange
        }),
        [props.items, props.onChange]
    );

    const presenter = useMemo(() => {
        return new RadioGroupPresenter();
    }, []);

    useEffect(() => {
        presenter.init(params);
    }, [params]);

    const [vm, setVm] = useState(presenter.vm);

    useEffect(() => {
        return autorun(() => {
            setVm(presenter.vm);
        });
    }, [presenter]);

    return { vm, changeValue: presenter.changeValue };
};
