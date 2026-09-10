import { useEffect, useMemo, useState } from "react";
import { autorun } from "mobx";
import type { IconPickerParams } from "./presenters/index.js";
import { IconPickerPresenter } from "./presenters/index.js";
import type { IconPickerPrimitiveProps } from "./IconPickerPrimitive.js";

export const useIconPicker = (props: IconPickerPrimitiveProps) => {
    const params: IconPickerParams = useMemo(
        () => ({
            icons: props.icons,
            onChange: props.onChange
        }),
        [props.icons, props.onChange]
    );

    const presenter = useMemo(() => {
        return new IconPickerPresenter();
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
        setListOpenState: presenter.setListOpenState,
        searchIcon: presenter.searchIcon,
        setSelectedIcon: presenter.setSelectedIcon
    };
};
