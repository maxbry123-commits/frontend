import { makeAutoObservable } from "mobx";
import type { IMultiAutoCompleteTemporaryOptionPresenter } from "./MultiAutoCompleteTemporaryOptionPresenter.js";
import type {
    IMultiAutoCompletePresenter,
    MultiAutoCompletePresenterParams
} from "./MultiAutoCompletePresenter.js";

class MultiAutoCompletePresenterWithFreeInput implements IMultiAutoCompletePresenter {
    private temporaryOptionPresenter: IMultiAutoCompleteTemporaryOptionPresenter;
    private multiAutoCompletePresenter: IMultiAutoCompletePresenter;

    constructor(
        temporaryOptionPresenter: IMultiAutoCompleteTemporaryOptionPresenter,
        multiAutoCompletePresenter: IMultiAutoCompletePresenter
    ) {
        this.temporaryOptionPresenter = temporaryOptionPresenter;
        this.multiAutoCompletePresenter = multiAutoCompletePresenter;
        makeAutoObservable(this);
    }

    init(params: MultiAutoCompletePresenterParams) {
        this.multiAutoCompletePresenter.init(params);
        this.temporaryOptionPresenter.init();
    }

    get vm() {
        return {
            ...this.multiAutoCompletePresenter.vm,
            temporaryOptionVm: this.temporaryOptionPresenter.vm
        };
    }

    setListOpenState = (open: boolean) => {
        this.multiAutoCompletePresenter.setListOpenState(open);
    };

    public searchOption = (value: string) => {
        this.multiAutoCompletePresenter.searchOption(value);
        this.temporaryOptionPresenter.setOption(value);
    };

    public setSelectedOption = (value: string) => {
        this.multiAutoCompletePresenter.setSelectedOption(value);
    };

    public removeSelectedOption = (value: string) => {
        this.multiAutoCompletePresenter.removeSelectedOption(value);
        this.temporaryOptionPresenter.resetOption();
    };

    public resetSelectedOptions = () => {
        this.multiAutoCompletePresenter.resetSelectedOptions();
        this.temporaryOptionPresenter.resetOption();
    };

    public createOption = (value: string) => {
        this.multiAutoCompletePresenter.createOption(value);
        this.multiAutoCompletePresenter.searchOption("");
        this.multiAutoCompletePresenter.setSelectedOption(value);
        this.temporaryOptionPresenter.resetOption();
    };
}

export { MultiAutoCompletePresenterWithFreeInput };
