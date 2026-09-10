import type { CheckboxItemFormatted } from "./CheckboxItemFormatted.js";
import type { CheckboxItem } from "./CheckboxItem.js";

export class CheckboxItemMapper {
    static toFormatted(item: CheckboxItem): CheckboxItemFormatted {
        return {
            id: item.id,
            label: item.label,
            value: item.value,
            checked: item.checked,
            indeterminate: item.indeterminate,
            disabled: item.disabled,
            hasLabel: !!item.label
        };
    }
}
