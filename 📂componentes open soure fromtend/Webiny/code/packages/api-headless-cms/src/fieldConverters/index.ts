/**
 * Field converters are used to convert the fieldId to storageId and vice versa.
 */
import { CmsModelObjectFieldConverterPlugin } from "~/fieldConverters/CmsModelObjectFieldConverterPlugin.js";
import { CmsModelDefaultFieldConverterPlugin } from "~/fieldConverters/CmsModelDefaultFieldConverterPlugin.js";
import { CmsModelDynamicZoneFieldConverterPlugin } from "~/fieldConverters/CmsModelDynamicZoneFieldConverterPlugin.js";

export const createFieldConverters = () => {
    return [
        new CmsModelObjectFieldConverterPlugin(),
        new CmsModelDynamicZoneFieldConverterPlugin(),
        new CmsModelDefaultFieldConverterPlugin()
    ];
};
