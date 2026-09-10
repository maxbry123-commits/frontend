import isInteger from "lodash/isInteger.js";
import ValidationError from "~/validationError.js";

export default (value: any) => {
    if (!value) {
        return;
    }

    if (isInteger(value)) {
        return;
    }

    throw new ValidationError("Value needs to be an integer.");
};
