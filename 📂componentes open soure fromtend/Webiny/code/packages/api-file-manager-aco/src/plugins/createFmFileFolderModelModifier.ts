import {
    type CmsModelField,
    type CmsModelModifierCallable,
    FolderCmsModelModifierPlugin,
    type IFolderModelFieldsModifier
} from "@webiny/api-aco";
import type { CmsModelField as BaseModelField } from "@webiny/api-headless-cms/types/index.js";

export class FolderModelFieldsModifier implements IFolderModelFieldsModifier {
    private fields: BaseModelField[] = [];
    private readonly namespace: string;

    constructor(namespace: string) {
        this.namespace = namespace;
    }

    setFields(fields: BaseModelField[]) {
        this.fields = fields;
    }

    addField(field: CmsModelField) {
        const { tags, ...rest } = field;

        this.fields.push({
            ...rest,
            id: `${this.namespace}_${field.id}`,
            fieldId: `${this.namespace}_${field.fieldId}`,
            storageId: `${field.type}@${this.namespace}_${field.id}`,
            tags: (tags ?? []).concat([`$namespace:${this.namespace}`])
        });
    }
}

export const createFmFileFolderModelModifier = (callback: CmsModelModifierCallable) => {
    const modifier = new FolderModelFieldsModifier("fm_file");

    return new FolderCmsModelModifierPlugin({
        callback,
        modifier
    });
};
