import camelCase from "lodash/camelCase.js";
import upperFirst from "lodash/upperFirst.js";
import pluralize from "pluralize";
import type { CmsModel } from "~/types/index.js";

export const ensureSingularApiName = (model: CmsModel): string => {
    if (!model.singularApiName) {
        return upperFirst(camelCase(model.modelId));
    }
    return model.singularApiName;
};

export const ensurePluralApiName = (model: CmsModel): string => {
    if (!model.pluralApiName) {
        return pluralize(ensureSingularApiName(model));
    }
    return model.pluralApiName;
};
