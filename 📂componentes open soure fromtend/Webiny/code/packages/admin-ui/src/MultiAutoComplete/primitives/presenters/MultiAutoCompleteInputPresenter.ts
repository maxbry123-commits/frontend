import { makeAutoObservable } from "mobx";

export interface MultiAutoCompleteInputPresenterParams {
    placeholder?: string;
    displayResetAction?: boolean;
}

export interface IMultiAutoCompleteInputPresenter {
    vm: {
        placeholder: string;
        value: string;
        displayResetAction: boolean;
    };
    init: (params: MultiAutoCompleteInputPresenterParams) => void;
    setValue: (query: string) => void;
    resetValue: () => void;
}

export class MultiAutoCompleteInputPresenter implements IMultiAutoCompleteInputPresenter {
    private searchQuery?: string = undefined;
    private placeholder?: string = undefined;
    private displayResetAction = true;

    constructor() {
        makeAutoObservable(this);
    }

    init(params?: MultiAutoCompleteInputPresenterParams) {
        this.placeholder = params?.placeholder;
        this.displayResetAction = params?.displayResetAction ?? true;
    }

    get vm() {
        return {
            placeholder: this.placeholder || "Start typing or select",
            value: this.searchQuery || "",
            displayResetAction: this.displayResetAction
        };
    }

    public setValue = (value: string) => {
        this.searchQuery = value;
    };

    public resetValue = () => {
        this.searchQuery = undefined;
    };
}
