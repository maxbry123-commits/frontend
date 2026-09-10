import { useContext } from "react";
import type { UiContextValue } from "~/contexts/Ui/index.js";
import { UiContext } from "~/contexts/Ui/index.js";

export const useUi = () => {
    return useContext(UiContext) as UiContextValue;
};
