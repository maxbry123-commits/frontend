import type { CreateFieldInput } from "./fields";
import { createField } from "./fields";

export const createBooleanField = (params: Partial<CreateFieldInput> = {}) => {
    return createField({
        id: "enabled",
        type: "boolean",
        fieldId: "enabled",
        label: "Enabled",
        ...params
    });
};
