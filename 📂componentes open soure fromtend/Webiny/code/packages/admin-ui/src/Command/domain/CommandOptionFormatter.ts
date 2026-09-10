import type { CommandOption } from "./CommandOption.js";
import type { CommandOptionFormatted } from "./CommandOptionFormatted.js";

export class CommandOptionFormatter {
    static format(option: CommandOption): CommandOptionFormatted {
        return {
            label: option.label,
            value: option.value,
            disabled: option.disabled,
            selected: option.selected,
            separator: option.separator,
            item: option.item
        };
    }
}
