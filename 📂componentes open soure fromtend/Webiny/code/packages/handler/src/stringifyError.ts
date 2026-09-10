export interface CustomError extends Error {
    code?: string;
    data?: Record<string, any>;
}

export const stringifyError = (error: CustomError) => {
    const { name, message, code, stack, data } = error;
    return JSON.stringify({
        ...error,
        constructorName: error.constructor?.name || "UnknownError",
        name: name || "No error name",
        message: message || "No error message",
        code: code || "NO_CODE",
        data,
        stack: process.env.DEBUG === "true" ? stack : "Turn on the debug flag to see the stack."
    });
};
