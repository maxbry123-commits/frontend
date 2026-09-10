import type { FileItem } from "./FileItem.js";
import type { FileItemFormatted } from "./FileItemFormatted.js";

export class FileItemFormatter {
    static format(item: FileItem): FileItemFormatted {
        return {
            id: item.id,
            name: item.name,
            url: item.url,
            mimeType: item.mimeType,
            size: item.size
        };
    }
}
