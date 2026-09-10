import type { BoxData } from "@webiny/website-builder-sdk";

export class Box {
    private readonly box: BoxData;
    private readonly _id: string;

    constructor(id: string, box: BoxData) {
        this._id = id;
        this.box = box;
    }

    get id() {
        return this._id;
    }

    get type() {
        return this.box.type;
    }

    get depth() {
        return this.box.depth;
    }

    get parentId() {
        return this.box.parentId;
    }

    get parentSlot() {
        return this.box.parentSlot;
    }

    get parentIndex() {
        return this.box.parentIndex;
    }

    get top() {
        return this.box.top;
    }

    get left() {
        return this.box.left;
    }

    get width() {
        return this.box.width;
    }

    get height() {
        return this.box.height;
    }

    get bottom() {
        return this.top + this.height;
    }

    get right() {
        return this.left + this.width;
    }

    toObject(): BoxData {
        return this.box;
    }
}
