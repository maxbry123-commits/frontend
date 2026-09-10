import ValidationError from "~/validationError.js";

// In array validator. This validator checks if the given value is allowed to.
export default (value: any, params?: string[]) => {
    if (!value || !params) {
        return;
    }
    value = value + "";

    if (params.includes(value)) {
        return;
    }

    throw new ValidationError("Value must be one of the following: " + params.join(", ") + ".");
};
