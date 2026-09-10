import { createGenericContext } from "@webiny/app-admin";
import type { FieldDTO } from "~/components/AdvancedSearch/domain/index.js";

export interface InputFieldContext {
    field: FieldDTO;
    name: string;
}

const { Provider, useHook } = createGenericContext<InputFieldContext>("InputFieldContext");

export const useInputField = useHook;
export const InputFieldProvider = Provider;
