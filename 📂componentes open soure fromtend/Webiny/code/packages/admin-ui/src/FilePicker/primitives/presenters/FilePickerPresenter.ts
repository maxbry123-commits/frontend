import { makeAutoObservable } from "mobx";
import {
    FileItem,
    type FileItemDto,
    type FileItemFormatted,
    FileItemFormatter
} from "../../domains/index.js";

interface FilePickerPresenterParams {
    value?: FileItemDto | string | null;
}

interface IFilePickerPresenter {
    vm: {
        file: FileItemFormatted | null;
    };
    init: (params: FilePickerPresenterParams) => void;
}

class FilePickerPresenter implements IFilePickerPresenter {
    private file: FileItem | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    public init = (params: FilePickerPresenterParams) => {
        const { value } = params;

        if (!value) {
            this.file = null;
            return;
        }

        if (typeof value === "string") {
            this.file = FileItem.createFromUrl(value);
            return;
        }

        this.file = FileItem.create(value);
    };

    get vm() {
        return {
            file: this.file ? FileItemFormatter.format(this.file) : null
        };
    }
}

export { FilePickerPresenter, type FilePickerPresenterParams, type IFilePickerPresenter };
