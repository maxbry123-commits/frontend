import type { TagItem } from "./TagItem.js";
import type { TagItemFormatted } from "./TagItemFormatted.js";

export class TagItemMapper {
    static toFormatted(item: TagItem): TagItemFormatted {
        return {
            id: item.id,
            label: item.label,
            protected: item.protected
        };
    }
}
