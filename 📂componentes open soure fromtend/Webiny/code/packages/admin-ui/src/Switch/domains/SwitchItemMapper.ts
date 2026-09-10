import type { SwitchItemFormatted } from "./SwitchItemFormatted.js";
import type { SwitchItem } from "./SwitchItem.js";

export class SwitchItemMapper {
    static toFormatted(item: SwitchItem): SwitchItemFormatted {
        return {
            id: item.id,
            label: item.label,
            value: item.value,
            checked: item.checked,
            disabled: item.disabled
        };
    }
}
