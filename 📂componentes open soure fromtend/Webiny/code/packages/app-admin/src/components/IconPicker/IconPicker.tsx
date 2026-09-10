import React, { useMemo, useEffect } from "react";
import { useIconPickerConfig } from "./config/index.js";
import { iconRepositoryFactory } from "./IconRepositoryFactory.js";
import { IconPickerPresenter } from "./IconPickerPresenter.js";
import type { IconPickerProps } from "./IconPickerComponent.js";
import { IconPickerComponent } from "./IconPickerComponent.js";
import { IconProvider, IconRenderer } from "./IconRenderer.js";
import { IconPickerTab } from "./IconPickerTab.js";
import type { Icon } from "./types.js";

const IconPicker = (props: IconPickerProps) => {
    const { iconTypes, iconPackProviders } = useIconPickerConfig();
    const repository = iconRepositoryFactory.getRepository(iconTypes, iconPackProviders);

    const presenter = useMemo(() => {
        return new IconPickerPresenter(repository, props.size);
    }, [repository, props.size]);

    useEffect(() => {
        presenter.load(props.value);
    }, [repository, props.value]);

    return <IconPickerComponent presenter={presenter} {...props} />;
};

interface IconRendererWithProviderProps {
    icon?: Icon;
    size?: number;
}

const IconRendererWithProvider = ({ icon, ...props }: IconRendererWithProviderProps) => {
    if (!icon) {
        return null;
    }

    return (
        <IconProvider icon={icon} {...props}>
            <IconRenderer />
        </IconProvider>
    );
};

IconPicker.Icon = IconRendererWithProvider;
IconPicker.IconPickerTab = IconPickerTab;

export { IconPicker };
