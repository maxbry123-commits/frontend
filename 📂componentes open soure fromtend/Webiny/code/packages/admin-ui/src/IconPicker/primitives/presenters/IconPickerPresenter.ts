import { makeAutoObservable } from "mobx";
import type { IconPickerIconDto, IconPickerFontAwesome } from "../../domains/index.js";
import { IconPickerIcon, IconPickerIconFormatter, ListCache } from "../../domains/index.js";

interface IconPickerParams {
    icons: IconPickerIconDto[];
    onChange?: (value: string) => void;
}

interface IIconPickerPresenter {
    vm: {
        open: boolean;
        icons: IconPickerFontAwesome[];
        iconsLength: number;
        searchQuery: string;
    };
    init: (params: IconPickerParams) => void;
    setListOpenState: (open: boolean) => void;
    searchIcon: (value: string) => void;
    setSelectedIcon: (icon: string) => void;
}

class IconPickerPresenter implements IIconPickerPresenter {
    private open = false;
    private icons = new ListCache<IconPickerIcon>();
    private searchQuery = "";
    private params?: IconPickerParams = undefined;

    constructor() {
        makeAutoObservable(this);
    }

    public init = (params: IconPickerParams) => {
        this.params = params;
        this.icons.clear();
        this.icons.addItems(params.icons.map(icon => IconPickerIcon.create(icon)));
    };

    get vm() {
        return {
            open: this.open,
            searchQuery: this.searchQuery,
            icons: this.getIcons().map(icon => IconPickerIconFormatter.formatFontAwesome(icon)),
            iconsLength: this.getIcons().length || 0
        };
    }

    public setListOpenState = (open: boolean) => {
        this.open = open;
    };

    public searchIcon = (value: string) => {
        this.searchQuery = value;
    };

    public setSelectedIcon = (icon: string) => {
        this.setListOpenState(false);
        this.params?.onChange?.(icon);
    };

    private getIcons = () => {
        if (this.searchQuery) {
            return this.icons.getItems(icon => icon.name.includes(this.searchQuery));
        }

        return this.icons.getItems();
    };
}

export { IconPickerPresenter, type IIconPickerPresenter, type IconPickerParams };
