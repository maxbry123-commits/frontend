import { useContext } from "react";
import { TypographyActionContext } from "~/context/TypographyActionContext.js";

export function useTypographyAction() {
    const context = useContext(TypographyActionContext);
    if (!context) {
        throw Error(
            `Missing TypographyActionContext in the component hierarchy. Are you using "useTypographyAction()" in the right place?`
        );
    }

    return context;
}
