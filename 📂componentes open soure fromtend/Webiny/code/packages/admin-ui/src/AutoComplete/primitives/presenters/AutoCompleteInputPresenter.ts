import { makeAutoObservable } from "mobx";

interface AutoCompleteInputPresenterParams {
    value?: string;
    placeholder?: string;
    displayResetAction?: boolean;
}

interface IAutoCompleteInputPresenter {
    vm: {
        placeholder: string;
        value: string;
        displayResetAction: boolean;
    };
    init: (params: AutoCompleteInputPresenterParams) => void;
    setValue: (query: string) => void;
    resetValue: () => void;
}

class AutoCompleteInputPresenter implements IAutoCompleteInputPresenter {
    private searchQuery?: string = undefined;
    private placeholder?: string = undefined;
    private displayResetAction?: boolean = true;

    constructor() {
        makeAutoObservable(this);
    }

    init(params?: AutoCompleteInputPresenterParams) {
        this.searchQuery = params?.value;
        this.placeholder = params?.placeholder;
        this.displayResetAction = params?.displayResetAction ?? true;
    }

    get vm() {
        return {
            placeholder: this.placeholder || "Start typing or select",
            value: this.searchQuery || "",
            displayResetAction: Boolean(this.displayResetAction && !!this.searchQuery)
        };
    }

    public setValue = (value: string) => {
        this.searchQuery = value;
    };

    public resetValue = () => {
        this.searchQuery = undefined;
    };
}

export {
    AutoCompleteInputPresenter,
    type IAutoCompleteInputPresenter,
    type AutoCompleteInputPresenterParams
};
