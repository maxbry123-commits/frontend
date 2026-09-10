import React from "react";
import { useSelectFromDocument } from "~/BaseEditor/hooks/useSelectFromDocument.js";
import { Preview } from "./Preview.js";

export const DocumentPreview = () => {
    const { id } = useSelectFromDocument(document => {
        return { id: document.id };
    });

    return <Preview key={id} />;
};
