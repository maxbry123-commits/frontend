class FunctionConverter {
    serialize(fn: (...args: any[]) => unknown) {
        return fn.toString();
    }

    deserialize(fn: string) {
        return new Function(`return ${fn}`)();
    }
}

export const functionConverter = new FunctionConverter();
