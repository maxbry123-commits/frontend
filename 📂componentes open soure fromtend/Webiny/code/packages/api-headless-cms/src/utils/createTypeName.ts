import upperFirst from "lodash/upperFirst.js";
import camelCase from "lodash/camelCase.js";

export const createTypeName = (modelId: string): string => {
    return upperFirst(camelCase(modelId));
};
