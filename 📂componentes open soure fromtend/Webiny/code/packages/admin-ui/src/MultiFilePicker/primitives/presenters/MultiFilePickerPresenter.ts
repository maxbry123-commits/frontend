import { makeAutoObservable } from "mobx";
import {
    FileItem,
    type FileItemDto,
    type FileItemFormatted,
    FileItemFormatter
} from "../../../FilePicker/domains/index.js";

interface MultiFilePickerPresenterParams {
    values?: FileItemDto[] | string[] | null;
}

interface IMultiFilePickerPresenter {
    vm: {
        files: FileItemFormatted[];
        hasFiles: boolean;
    };
    init: (params: MultiFilePickerPresenterParams) => void;
}

class MultiFilePickerPresenter implements IMultiFilePickerPresenter {
    private files: FileItem[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    public init = (params: MultiFilePickerPresenterParams) => {
        const { values } = params;
        this.files = this.getFiles(values);
    };

    get vm() {
        return {
            files: this.files?.map(file => FileItemFormatter.format(file)),
            hasFiles: !!this.files.length
        };
    }

    private getFiles = (values: FileItemDto[] | string[] | null | undefined): FileItem[] => {
        if (!values || !values?.length) {
            return [];
        }

        return values.map(value => {
            if (typeof value === "string") {
                return FileItem.createFromUrl(value);
            }

            return FileItem.create(value);
        });
    };
}

export {
    MultiFilePickerPresenter,
    type MultiFilePickerPresenterParams,
    type IMultiFilePickerPresenter
};
