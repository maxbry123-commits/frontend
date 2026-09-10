import type { Node } from "./Node.js";
import type { NodeFormatted } from "~/Tree/domains/NodeFormatted.js";
import type { NodeDto } from "~/Tree/domains/NodeDto.js";

export class NodeFormatter {
    static toFormatted<TData = Record<string, any>>(
        item: Node<TData>,
        loadingNodeIds: string[]
    ): NodeFormatted<TData> {
        return {
            id: item.id,
            text: item.label,
            parent: item.parentId,
            droppable: item.droppable ?? true,
            data: {
                id: item.id,
                label: item.label,
                parentId: item.parentId,
                droppable: item.droppable ?? true,
                active: item.active ?? false,
                loading: loadingNodeIds.includes(item.id),
                ...item.data
            }
        };
    }

    static toDto<TData = Record<string, any>>(item: Node<TData>): NodeDto<TData> {
        return {
            id: item.id,
            label: item.label,
            parentId: item.parentId,
            droppable: item.droppable,
            data: item.data
        };
    }
}
