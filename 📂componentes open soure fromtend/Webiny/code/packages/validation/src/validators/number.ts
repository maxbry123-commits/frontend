import isNaN from "lodash/isNaN.js";
import isNumber from "lodash/isNumber.js";
import ValidationError from "~/validationError.js";

/**
 * @function number
 * @description This validator checks of the given value is a number
 * @param {any} value
 * @return {boolean}
 */
export default (value: any) => {
    if (!value && !isNaN(value)) {
        return;
    }

    if (isNumber(value) && !isNaN(value)) {
        return;
    }

    throw new ValidationError("Value needs to be a number.");
};
