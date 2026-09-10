import { makeAutoObservable } from "mobx";
import type { SwitchPrimitivVm } from "../SwitchPrimitive.js";
import type { SwitchItemDto } from "../../domains/index.js";
import { SwitchItem, SwitchItemMapper } from "../../domains/index.js";

type SwitchPresenterParams = SwitchItemDto & {
    onChange?: (checked: boolean) => void;
};

interface ISwitchPresenter<TParams extends SwitchPresenterParams = SwitchPresenterParams> {
    vm: SwitchPrimitivVm;
    init: (params: TParams) => void;
    changeChecked: (checked: boolean) => void;
}

class SwitchPresenter implements ISwitchPresenter {
    private params?: SwitchPresenterParams = undefined;
    private item?: SwitchItem = undefined;

    constructor() {
        makeAutoObservable(this);
    }

    public init = (params: SwitchPresenterParams) => {
        this.params = params;
        this.item = SwitchItem.create({
            id: params.id,
            label: params.label,
            value: params.value,
            checked: params.checked,
            disabled: params.disabled
        });
    };

    get vm() {
        return {
            item: this.item ? SwitchItemMapper.toFormatted(this.item) : undefined
        };
    }

    public changeChecked = (checked: boolean) => {
        this.params?.onChange?.(checked);
    };
}

export { SwitchPresenter, type SwitchPresenterParams, type ISwitchPresenter };
