import { useEffect, useMemo, useState } from "react";
import { autorun } from "mobx";
import type { ProgressBarProps } from "./ProgressBar.js";
import { ProgressBarPresenter, type ProgressBarPresenterParams } from "./presenters/index.js";

export const useProgressBar = (props: ProgressBarProps) => {
    const params: ProgressBarPresenterParams = useMemo(
        () => ({
            value: props.value,
            max: props.max,
            getValueLabel: props.getValueLabel
        }),
        [props.value, props.max, props.getValueLabel]
    );

    const presenter = useMemo(() => {
        return new ProgressBarPresenter();
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

    return {
        vm
    };
};
