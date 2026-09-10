import { useSelectFromDocument } from "~/BaseEditor/hooks/useSelectFromDocument.js";
import { StatePathsExtractor } from "~/BaseEditor/defaultConfig/Sidebar/ElementSettings/StatePathsExtractor.js";

export const useStateArrays = () => {
    return useSelectFromDocument(document => {
        return new StatePathsExtractor(document.state)
            .getPaths()
            .filter(option => option.type.isArray())
            .values();
    });
};
