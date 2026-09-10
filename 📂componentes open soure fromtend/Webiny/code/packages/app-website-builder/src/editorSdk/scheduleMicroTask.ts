export const scheduleMicroTask: (fn: () => void) => void =
    typeof queueMicrotask === "function"
        ? queueMicrotask
        : fn => {
              Promise.resolve().then(fn);
          };
