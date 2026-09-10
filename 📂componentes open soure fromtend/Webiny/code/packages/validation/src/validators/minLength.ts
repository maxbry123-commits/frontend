import has from "lodash/has.js";
import keys from "lodash/keys.js";
import isString from "lodash/isString.js";
import isObject from "lodash/isObject.js";
import ValidationError from "~/validationError.js";

export default (value: any, params?: string[]) => {
    if (!value || !params) {
        return;
    }

    let lengthOfValue = null;
    if (has(value, "length")) {
        lengthOfValue = value.length;
    } else if (isObject(value)) {
        lengthOfValue = keys(value).length;
    }

    if (lengthOfValue === null || lengthOfValue >= params[0]) {
        return;
    }

    if (isString(value)) {
        throw new ValidationError("Value requires at least " + params[0] + " characters.");
    }
    throw new ValidationError("Value requires at least " + params[0] + " items.");
};
