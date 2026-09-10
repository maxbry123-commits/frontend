import { useDragLayer } from "react-dnd";

export function useIsDragging(): boolean {
    return useDragLayer(monitor => monitor.isDragging());
}
