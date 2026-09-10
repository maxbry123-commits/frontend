import React from "react";

export interface CompositionScopeContext {
    inherit: boolean;
    scope: string[];
}

const CompositionScopeContext = React.createContext<CompositionScopeContext | undefined>(undefined);

interface CompositionScopeProps {
    name: string;
    /**
     * Use this prop on components that are used to register decorators.
     * Components are inherited at the time of registration, and then cached.
     */
    inherit?: boolean;
    children: React.ReactNode;
}

export const CompositionScope = ({ name, inherit = false, children }: CompositionScopeProps) => {
    const parentScope = useCompositionScope();

    return (
        <CompositionScopeContext.Provider value={{ scope: [...parentScope.scope, name], inherit }}>
            {children}
        </CompositionScopeContext.Provider>
    );
};

export function useCompositionScope() {
    const context = React.useContext(CompositionScopeContext);

    if (!context) {
        return { scope: [], inherit: false };
    }

    return context;
}
