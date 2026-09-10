import { makeAutoObservable } from "mobx";

interface ProgressBarPresenterParams {
    value?: number | null;
    max?: number;
    getValueLabel?: (value: number, max: number) => string;
}

interface ProgressBarVm {
    value: number;
    textValue: string;
    min: number;
    textMin: string;
    max: number;
    textMax: string;
}

interface IProgressBarPresenter {
    get vm(): ProgressBarVm;
    init: (params: ProgressBarPresenterParams) => void;
}

class ProgressBarPresenter implements IProgressBarPresenter {
    private params?: ProgressBarPresenterParams = undefined;

    constructor() {
        makeAutoObservable(this);
    }

    init(params: ProgressBarPresenterParams) {
        this.params = params;
    }

    get vm(): ProgressBarVm {
        return {
            value: this.value,
            textValue: this.getValueLabel(this.value, this.max),
            min: this.min,
            textMin: String(this.min),
            max: this.max,
            textMax: String(this.max)
        };
    }

    private get value(): number {
        return this.params?.value ?? 0;
    }

    private get min(): number {
        return 0;
    }

    private get max(): number {
        return this.params?.max ?? 100;
    }

    private getValueLabel(value: number, max: number): string {
        if (this.params?.getValueLabel) {
            return this.params.getValueLabel(value, max);
        }
        return `${Math.round((value / max) * 100)}%`;
    }
}

export { ProgressBarPresenter, type ProgressBarVm, type ProgressBarPresenterParams };
