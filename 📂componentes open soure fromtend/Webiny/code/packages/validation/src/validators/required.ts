import ValidationError from "~/validationError.js";

const throwError = () => {
    throw new ValidationError("Value is required.");
};

export default (value: any) => {
    if (value === "" || value === null || value === undefined) {
        throwError();
    }
};
