/**
 * Field converters are used to convert the fieldId to storageId and vice versa.
 */
import { Plugin } from "@webiny/plugins";
import type { CmsEntryValues, CmsModelFieldWithParent } from "~/types/index.js";
import type { ConverterCollection } from "~/utils/converters/ConverterCollection.js";

export interface ConvertParams<F = CmsModelFieldWithParent> {
    field: F;
    value: any;
    converterCollection: ConverterCollection;
}

export abstract class CmsModelFieldConverterPlugin extends Plugin {
    public static override type = "cms.field.converter";

    public abstract getFieldType(): string;

    public abstract convertToStorage(params: ConvertParams): CmsEntryValues;
    public abstract convertFromStorage(params: ConvertParams): CmsEntryValues;
}
