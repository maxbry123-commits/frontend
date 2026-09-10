import { makeAutoObservable } from "mobx";
import { CommandOption } from "~/Command/domain/CommandOption.js";
import type {
    AutoCompleteInputPresenterParams,
    IAutoCompleteInputPresenter
} from "./AutoCompleteInputPresenter.js";
import type { IAutoCompleteListOptionsPresenter } from "./AutoCompleteListOptionsPresenter.js";
import type { AutoCompleteOption } from "../../domains/index.js";

interface AutoCompletePresenterParams {
    emptyMessage?: any;
    loadingMessage?: any;
    initialMessage?: any;
    onOpenChange?: (open: boolean) => void;
    onValueChange: (value: string) => void;
    onValueReset?: () => void;
    onValueSearch?: (value: string) => void;
    options?: AutoCompleteOption[];
    value?: string;
}

interface IAutoCompletePresenterParams {
    vm: {
        inputVm: IAutoCompleteInputPresenter["vm"];
        optionsListVm: IAutoCompleteListOptionsPresenter["vm"];
    };
    init: (params: AutoCompletePresenterParams) => void;
    initInput: (params: AutoCompleteInputPresenterParams) => void;
    setListOpenState: (open: boolean) => void;
    setSelectedOption: (value: string) => void;
    showSelectedOption: () => void;
    searchOption: (value: string) => void;
    resetSelectedOption: () => void;
}

class AutoCompletePresenter implements IAutoCompletePresenterParams {
    private params?: AutoCompletePresenterParams = undefined;
    private inputPresenter: IAutoCompleteInputPresenter;
    private optionsListPresenter: IAutoCompleteListOptionsPresenter;

    constructor(
        inputPresenter: IAutoCompleteInputPresenter,
        optionsListPresenter: IAutoCompleteListOptionsPresenter
    ) {
        this.inputPresenter = inputPresenter;
        this.optionsListPresenter = optionsListPresenter;
        makeAutoObservable(this);
    }

    init(params: AutoCompletePresenterParams) {
        this.params = params;

        const listOptions = this.getListOptions(params.options, params.value);
        this.optionsListPresenter.init({
            options: listOptions,
            emptyMessage: params.emptyMessage,
            loadingMessage: params.loadingMessage,
            initialMessage: params.initialMessage
        });
    }

    initInput(params: AutoCompleteInputPresenterParams) {
        const selected = this.getSelectedOption();
        this.inputPresenter.init({
            value: selected?.label ?? "",
            placeholder: params.placeholder,
            displayResetAction: params.displayResetAction
        });
    }

    get vm() {
        return {
            inputVm: this.inputPresenter.vm,
            optionsListVm: this.optionsListPresenter.vm
        };
    }

    public setListOpenState = (open: boolean) => {
        this.optionsListPresenter.setListOpenState(open);
        this.params?.onOpenChange?.(open);
    };

    public searchOption = (value: string) => {
        this.inputPresenter.setValue(value);
        this.optionsListPresenter.setLoadedOptions(true);
        this.params?.onValueSearch?.(value);
    };

    public setSelectedOption = (value: string) => {
        this.inputPresenter.resetValue();
        this.optionsListPresenter.resetSelectedOption();
        this.optionsListPresenter.setSelectedOption(value);
        const selectedOption = this.getSelectedOption();

        if (selectedOption) {
            this.inputPresenter.setValue(selectedOption.label);
            this.params?.onValueChange?.(selectedOption.value);
        } else {
            this.params?.onValueChange?.("");
        }
    };

    public resetSelectedOption = () => {
        this.optionsListPresenter.resetSelectedOption();
        this.inputPresenter.resetValue();

        this.params?.onValueChange?.("");
        this.params?.onValueReset?.();
    };

    public showSelectedOption = () => {
        const selected = this.getSelectedOption();
        this.inputPresenter.setValue(selected?.label ?? "");
    };

    private getListOptions(options: AutoCompleteOption[] = [], value?: string): CommandOption[] {
        return options.map(option => {
            const commandOption =
                typeof option === "string"
                    ? CommandOption.createFromString(option)
                    : CommandOption.create(option);

            commandOption.selected = commandOption.value === value;
            return commandOption;
        });
    }

    private getSelectedOption() {
        return this.vm.optionsListVm.options.find(option => option.selected);
    }
}

export { AutoCompletePresenter, type AutoCompletePresenterParams };
