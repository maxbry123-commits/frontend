import { useEffect, useMemo, useState } from "react";
import { autorun } from "mobx";
import {
    MultiFilePickerPresenter,
    type MultiFilePickerPresenterParams
} from "./presenters/MultiFilePickerPresenter.js";
import type { MultiFilePickerPrimitiveProps } from "~/MultiFilePicker/index.js";

type IMultiFilePickerPrimitiveProps = Pick<MultiFilePickerPrimitiveProps, "values">;

export const useMultiFilePicker = (props: IMultiFilePickerPrimitiveProps) => {
    const params: MultiFilePickerPresenterParams = useMemo(
        () => ({
            values: props.values
        }),
        [props.values]
    );

    const presenter = useMemo(() => {
        return new MultiFilePickerPresenter();
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
