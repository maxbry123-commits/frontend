import { makeAutoObservable, toJS } from "mobx";

import type { IconRepository } from "./IconRepository.js";
import type { Icon } from "./types.js";
import type { IconType } from "./config/index.js";

export interface IconPickerPresenterInterface {
    load(icon: Icon): Promise<void>;
    setIcon(icon: Icon): void;
    addIcon(icon: Icon): void;
    setFilter(value: string): void;
    setActiveTab(index: string): void;
    openMenu(): void;
    closeMenu(): void;
    get vm(): {
        isLoading: boolean;
        activeTab?: string;
        isMenuOpened: boolean;
        icons: Icon[];
        iconTypes: IconType[];
        selectedIcon: Icon | null;
        filter: string;
        size?: string;
    };
}

export class IconPickerPresenter implements IconPickerPresenterInterface {
    private repository: IconRepository;
    private selectedIcon: Icon | null = null;
    private filter = "";
    private activeTab: string | undefined = undefined;
    private isMenuOpened = false;
    private size: string | undefined;

    constructor(repository: IconRepository, size?: string) {
        this.repository = repository;
        this.size = size;
        makeAutoObservable(this);
    }

    async load(icon: Icon | null = null) {
        if (icon?.value) {
            this.selectedIcon = icon;
        }

        await this.repository.loadIcons();

        if (icon && !icon?.value) {
            this.detectSelectedIcon(icon);
        }
    }

    get vm() {
        return {
            activeTab: this.activeTab,
            isMenuOpened: this.isMenuOpened,
            isLoading: this.repository.getLoading().isLoading,
            icons: this.getFilteredIcons(),
            iconTypes: this.repository.getIconTypes(),
            // `toJS` will unwrap an observable into a POJO. This will make it simple to use in child components.
            selectedIcon: toJS(this.selectedIcon),
            filter: this.filter,
            size: this.size
        };
    }

    addIcon(icon: Icon) {
        this.repository.addIcon(icon);
    }

    closeMenu(): void {
        this.isMenuOpened = false;
    }

    openMenu(): void {
        this.isMenuOpened = true;
        this.resetActiveTab();
    }

    setActiveTab(value?: string) {
        this.activeTab = value;
    }

    setIcon(icon: Icon | null) {
        this.selectedIcon = icon;
    }

    setFilter(value: string) {
        this.filter = value;
    }

    private getFilteredIcons() {
        const hyphenUnderscoreRegex = /[-_]/g;
        const icons = this.repository.getIcons();

        return icons.filter(icon =>
            icon.name
                .replace(hyphenUnderscoreRegex, " ")
                .toLowerCase()
                .includes(this.filter.toLowerCase())
        );
    }

    private getActiveTabByType(type: string) {
        const iconTypes = this.repository.getIconTypes();
        const iconType = iconTypes.find(iconsByType => iconsByType.name === type);

        return iconType?.name || iconTypes[0].name;
    }

    private getDefaultTab() {
        return this.repository.getIconTypes()[0].name;
    }

    private resetActiveTab() {
        this.setActiveTab(
            this.selectedIcon
                ? this.getActiveTabByType(this.selectedIcon.type)
                : this.getDefaultTab()
        );
    }

    private detectSelectedIcon(icon: Icon) {
        const iconByName = this.repository
            .getIcons()
            .find(x => x.name === icon.name && icon.type === x.type);

        if (iconByName) {
            this.selectedIcon = iconByName;
        }
    }
}
