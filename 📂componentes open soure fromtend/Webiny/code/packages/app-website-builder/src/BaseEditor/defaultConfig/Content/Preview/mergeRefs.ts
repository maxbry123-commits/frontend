export function mergeRefs<T = any>(...refs: (React.Ref<T> | undefined)[]): React.RefCallback<T> {
    return (value: T) => {
        for (const ref of refs) {
            if (typeof ref === "function") {
                ref(value);
            } else if (ref && typeof ref === "object") {
                (ref as React.MutableRefObject<T | null>).current = value;
            }
        }
    };
}
