import type { CmsModelField as BaseModelField } from "@webiny/api-headless-cms/types/index.js";
import {
    type CmsModelField,
    FolderCmsModelModifierPlugin,
    type IFolderModelFieldsModifier
} from "@webiny/api-aco";

class FolderModelFieldsModifier implements IFolderModelFieldsModifier {
    private fields: BaseModelField[] = [];
    private readonly namespace = "cms";

    setFields(fields: BaseModelField[]) {
        this.fields = fields;
    }

    addField(field: CmsModelField) {
        const { tags, modelIds = [], ...rest } = field;
        const baseTags = [`$namespace:${this.namespace}`];

        if (modelIds.length > 0) {
            modelIds.forEach(modelId => {
                this.fields.push({
                    ...rest,
                    id: `${this.namespace}_${modelId}_${field.id}`,
                    fieldId: `${this.namespace}_${modelId}_${field.fieldId}`,
                    storageId: `${field.type}@${this.namespace}_${modelId}_${field.id}`,
                    tags: (tags ?? []).concat(baseTags, `$modelId:${modelId}`)
                });
            });
        } else {
            this.fields.push({
                ...rest,
                id: `${this.namespace}_${field.id}`,
                fieldId: `${this.namespace}_${field.fieldId}`,
                storageId: `${field.type}@${this.namespace}_${field.id}`,
                tags: (tags ?? []).concat(baseTags)
            });
        }
    }
}

interface CmsModelModifierCallableParams {
    modifier: IFolderModelFieldsModifier;
}

interface CmsModelModifierCallable {
    (params: CmsModelModifierCallableParams): Promise<void> | void;
}

export const createCmsFolderModelModifier = (callback: CmsModelModifierCallable) => {
    const modifier = new FolderModelFieldsModifier();

    return new FolderCmsModelModifierPlugin({
        callback,
        modifier
    });
};
