import { useEffect, useMemo, useState } from "react";
import { autorun } from "mobx";
import type { AutoCompletePrimitiveProps } from "./AutoCompletePrimitive.js";
import type {
    AutoCompletePresenterParams,
    AutoCompleteInputPresenterParams
} from "./presenters/index.js";
import {
    AutoCompletePresenter,
    AutoCompleteInputPresenter,
    AutoCompleteListOptionsPresenter
} from "./presenters/index.js";

export const useAutoComplete = (props: AutoCompletePrimitiveProps) => {
    const params: AutoCompletePresenterParams = useMemo(
        () => ({
            options: props.options,
            value: props.value,
            emptyMessage: props.emptyMessage,
            loadingMessage: props.loadingMessage,
            initialMessage: props.initialMessage,
            onOpenChange: props.onOpenChange,
            onValueChange: props.onValueChange,
            onValueReset: props.onValueReset,
            onValueSearch: props.onValueSearch
        }),
        [
            props.options,
            props.value,
            props.emptyMessage,
            props.loadingMessage,
            props.initialMessage,
            props.onOpenChange,
            props.onValueChange,
            props.onValueReset,
            props.onValueSearch
        ]
    );

    const inputParams: AutoCompleteInputPresenterParams = useMemo(
        () => ({
            value: props.value,
            placeholder: props.placeholder,
            displayResetAction: props.displayResetAction
        }),
        [props.value, props.placeholder, props.displayResetAction]
    );

    const presenter = useMemo(() => {
        const inputPresenter = new AutoCompleteInputPresenter();
        const optionsListPresenter = new AutoCompleteListOptionsPresenter();
        const presenter = new AutoCompletePresenter(inputPresenter, optionsListPresenter);
        presenter.init(params);
        return presenter;
    }, []);

    const [vm, setVm] = useState(presenter.vm);

    useEffect(() => {
        presenter.init(params);
    }, [params]);

    useEffect(() => {
        presenter.initInput(inputParams);
    }, [inputParams]);

    useEffect(() => {
        return autorun(() => {
            setVm(presenter.vm);
        });
    }, [presenter]);

    return {
        vm,
        setSelectedOption: presenter.setSelectedOption,
        searchOption: presenter.searchOption,
        resetSelectedOption: presenter.resetSelectedOption,
        setListOpenState: presenter.setListOpenState,
        showSelectedOption: presenter.showSelectedOption
    };
};
