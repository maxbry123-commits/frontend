import type { CreateFieldInput } from "./fields";
import { createField } from "./fields";

export const createDateTimeField = (params: Partial<CreateFieldInput> = {}) => {
    return createField({
        id: "xyzPublishedOn",
        type: "datetime",
        fieldId: "xyzPublishedOn",
        label: "Xyz published on",
        settings: {
            type: "dateTimeWithTimezone"
        },
        ...params
    });
};
