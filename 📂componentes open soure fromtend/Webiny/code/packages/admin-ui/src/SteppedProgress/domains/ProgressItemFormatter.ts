import type { ProgressItem } from "~/SteppedProgress/domains/ProgressItem.js";
import type { ProgressItemFormatted } from "~/SteppedProgress/domains/ProgressItemFormatted.js";

export class ProgressItemFormatter {
    static format(item: ProgressItem): ProgressItemFormatted {
        return {
            id: item.id,
            label: item.label,
            disabled: item.disabled,
            errored: item.errored,
            state: item.state
        };
    }
}
