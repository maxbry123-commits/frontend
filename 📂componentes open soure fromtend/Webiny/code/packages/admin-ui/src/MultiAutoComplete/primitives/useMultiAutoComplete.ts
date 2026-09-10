import { useEffect, useMemo, useState } from "react";
import { autorun } from "mobx";
import type { MultiAutoCompletePrimitiveProps } from "./MultiAutoCompletePrimitive.js";
import type { MultiAutoCompletePresenterParams } from "./presenters/index.js";
import {
    MultiAutoCompleteInputPresenter,
    MultiAutoCompleteListOptionsPresenter,
    MultiAutoCompleteListOptionsPresenterWithUniqueValues,
    MultiAutoCompletePresenter,
    MultiAutoCompletePresenterWithFreeInput,
    MultiAutoCompleteSelectedOptionPresenter
} from "./presenters/index.js";
import { MultiAutoCompleteTemporaryOptionPresenter } from "~/MultiAutoComplete/primitives/presenters/MultiAutoCompleteTemporaryOptionPresenter.js";

export const useMultiAutoComplete = (props: MultiAutoCompletePrimitiveProps) => {
    const params: MultiAutoCompletePresenterParams = useMemo(
        () => ({
            displayResetAction: props.displayResetAction,
            emptyMessage: props.emptyMessage,
            loadingMessage: props.loadingMessage,
            initialMessage: props.initialMessage,
            onOpenChange: props.onOpenChange,
            onValueSearch: props.onValueSearch,
            onValuesChange: props.onValuesChange,
            onValuesReset: props.onValuesReset,
            options: props.options,
            placeholder: props.placeholder,
            values: props.values
        }),
        [
            props.displayResetAction,
            props.emptyMessage,
            props.loadingMessage,
            props.initialMessage,
            props.onOpenChange,
            props.onValueSearch,
            props.onValuesChange,
            props.onValuesReset,
            props.options,
            props.placeholder,
            props.values
        ]
    );

    const presenter = useMemo(() => {
        const optionsListPresenter = new MultiAutoCompleteListOptionsPresenter();
        const optionsListWithUniqueValues =
            new MultiAutoCompleteListOptionsPresenterWithUniqueValues(optionsListPresenter);

        const inputPresenter = new MultiAutoCompleteInputPresenter();
        const selectedOptionsPresenter = new MultiAutoCompleteSelectedOptionPresenter();

        let presenter = new MultiAutoCompletePresenter(
            inputPresenter,
            selectedOptionsPresenter,
            optionsListPresenter
        );

        if (props?.uniqueValues) {
            presenter = new MultiAutoCompletePresenter(
                inputPresenter,
                selectedOptionsPresenter,
                optionsListWithUniqueValues
            );
        }

        if (props?.allowFreeInput) {
            const temporaryOptionsPresenter = new MultiAutoCompleteTemporaryOptionPresenter();
            const withFreeInputPresenter = new MultiAutoCompletePresenterWithFreeInput(
                temporaryOptionsPresenter,
                presenter
            );
            withFreeInputPresenter.init(params);
            return withFreeInputPresenter;
        } else {
            presenter.init(params);
            return presenter;
        }
    }, [props.allowFreeInput, props.uniqueValues]);

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
        setSelectedOption: presenter.setSelectedOption,
        removeSelectedOption: presenter.removeSelectedOption,
        searchOption: presenter.searchOption,
        resetSelectedOptions: presenter.resetSelectedOptions,
        setListOpenState: presenter.setListOpenState,
        createOption: presenter.createOption
    };
};
