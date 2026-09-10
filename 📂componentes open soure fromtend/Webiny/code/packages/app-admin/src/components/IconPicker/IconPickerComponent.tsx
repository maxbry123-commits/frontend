import React, { useEffect, useCallback, useMemo } from "react";
import { observer } from "mobx-react-lite";
import isEqual from "lodash/isEqual.js";
import type { FormComponentProps } from "@webiny/admin-ui";
import {
    FormComponentDescription,
    FormComponentErrorMessage,
    FormComponentLabel,
    PopoverPrimitive
} from "@webiny/admin-ui";
import { IconPickerContent, IconPickerTrigger } from "./components/index.js";
import type { IconPickerPresenter } from "./IconPickerPresenter.js";
import { IconPickerPresenterProvider } from "./IconPickerPresenterProvider.js";
import type { Icon } from "./types.js";
import { ICON_PICKER_SIZE } from "./types.js";

export interface IconPickerProps extends FormComponentProps {
    size?: ICON_PICKER_SIZE;
    removable?: boolean;
    value?: Icon;
    onChange?: (value: Icon | undefined) => void;
}

export interface IconPickerComponentProps extends IconPickerProps {
    presenter: IconPickerPresenter;
}

export const IconPickerComponent = observer(
    ({
        presenter,
        label,
        description,
        removable,
        required,
        disabled,
        ...props
    }: IconPickerComponentProps) => {
        const { value, onChange } = props;
        const { isValid: validationIsValid, message: validationMessage } = props.validation || {};
        const invalid = useMemo(() => validationIsValid === false, [validationIsValid]);
        const { activeTab, isMenuOpened, isLoading, iconTypes, selectedIcon, size } = presenter.vm;

        useEffect(() => {
            if (onChange && selectedIcon && !isEqual(selectedIcon, value)) {
                onChange(selectedIcon);
            }
        }, [JSON.stringify(selectedIcon)]);

        const removeIcon = useCallback(() => {
            if (onChange) {
                presenter.setIcon(null);
                onChange(undefined);
            }
        }, [onChange]);

        const handleOnOpenChange = useCallback(
            (open: boolean) => {
                if (open) {
                    return presenter.openMenu();
                } else {
                    return presenter.closeMenu();
                }
            },
            [presenter.openMenu, presenter.closeMenu]
        );

        return (
            <IconPickerPresenterProvider presenter={presenter}>
                <FormComponentLabel text={label} required={required} disabled={disabled} />
                <FormComponentDescription text={description} />
                <PopoverPrimitive open={isMenuOpened} onOpenChange={handleOnOpenChange}>
                    <PopoverPrimitive.Trigger>
                        <IconPickerTrigger icon={selectedIcon} />
                    </PopoverPrimitive.Trigger>
                    <PopoverPrimitive.Content
                        style={{ width: size === ICON_PICKER_SIZE.SMALL ? "248px" : "328px" }}
                    >
                        <IconPickerContent
                            loading={isLoading}
                            removable={value && removable}
                            iconTypes={iconTypes}
                            activeTab={activeTab}
                            removeIcon={removeIcon}
                        />
                    </PopoverPrimitive.Content>
                </PopoverPrimitive>
                <FormComponentErrorMessage text={validationMessage} invalid={invalid} />
            </IconPickerPresenterProvider>
        );
    }
);
