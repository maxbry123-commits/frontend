import type { CreateFieldInput } from "./field.base";
import { createField } from "./field.base";

export const createTextField = (params: Partial<CreateFieldInput> = {}) => {
    return createField({
        id: "title",
        type: "text",
        fieldId: "title",
        label: "Title",
        ...params
    });
};
