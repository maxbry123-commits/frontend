import React, { useState } from "react";

interface ExpandedEditorContext {
    isExpanded: boolean;
    setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

const ExpandedEditorContext = React.createContext<ExpandedEditorContext | undefined>(undefined);

export const ExpandedEditorProvider = ({ children }: { children: React.ReactNode }) => {
    const [isExpanded, setExpanded] = useState(false);
    return (
        <ExpandedEditorContext.Provider value={{ isExpanded, setExpanded }}>
            {children}
        </ExpandedEditorContext.Provider>
    );
};

export const useExpandedEditor = () => {
    const context = React.useContext(ExpandedEditorContext);
    if (!context) {
        throw new Error(`Missing ExpandedEditorProvider in the component hierarchy!`);
    }

    return context;
};
