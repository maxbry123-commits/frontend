type Decorators<TDecoratee> = {
    [K in keyof TDecoratee]?: (decoratee: TDecoratee[K]) => TDecoratee[K];
};

export const decorateContext = <T extends Record<string, any>>(
    decoratee: T,
    decorators: Decorators<T>
) => {
    return Object.keys(decorators).reduce((acc, key) => {
        const decoratedMethod = acc[key];

        return {
            ...acc,
            [key]: function (...args: any[]) {
                // @ts-expect-error
                return decorators[key](decoratedMethod.bind(decoratee))(...args);
            }
        };
    }, decoratee);
};
