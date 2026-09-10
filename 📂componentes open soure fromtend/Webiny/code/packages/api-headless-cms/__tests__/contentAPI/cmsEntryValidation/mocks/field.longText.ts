import type { CreateFieldInput } from "./fields";
import { createField } from "./fields";

export const createLongTextField = (params: Partial<CreateFieldInput> = {}) => {
    return createField({
        id: "description",
        type: "long-text",
        fieldId: "description",
        label: "Description",
        ...params
    });
};
