import { ProgressItemState } from "./ProgressItemState.js";
import { generateId } from "~/utils.js";

export interface ProgressItemParams {
    label: string;
    id?: string;
    disabled?: boolean;
    errored?: boolean;
    state?: ProgressItemState;
}

export class ProgressItem {
    private readonly _label: string;
    private readonly _id: string;
    private readonly _disabled: boolean;
    private readonly _errored: boolean;
    private readonly _state: ProgressItemState;

    protected constructor(params: ProgressItemParams) {
        this._label = params.label;
        this._id = generateId(params.id);
        this._disabled = params.disabled || false;
        this._errored = params.errored || false;
        this._state = params.state || ProgressItemState.IDLE;
    }

    static create(data: ProgressItemParams) {
        return new ProgressItem(data);
    }

    get id() {
        return this._id;
    }

    get label() {
        return this._label;
    }

    get disabled() {
        return this._disabled;
    }

    get errored() {
        return this._errored;
    }

    get state() {
        return this._state;
    }
}
