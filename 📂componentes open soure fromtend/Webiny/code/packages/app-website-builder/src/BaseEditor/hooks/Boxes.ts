import type { BoxData } from "@webiny/website-builder-sdk";
import { Box } from "~/BaseEditor/defaultConfig/Content/Preview/Box.js";

export class Boxes {
    private readonly boxes: Map<string, Box>;

    constructor(initial: Record<string, BoxData>) {
        this.boxes = new Map(
            Object.entries(initial).map(([id, box]) => {
                return [id, new Box(id, box)];
            })
        );
    }

    get(id: string): Box | undefined {
        return this.boxes.get(id);
    }

    filter(predicate: (box: Box) => boolean): Boxes {
        const result: Record<string, BoxData> = {};
        for (const [id, box] of this.boxes) {
            if (predicate(box)) {
                result[id] = box.toObject();
            }
        }
        return new Boxes(result);
    }

    map<T>(
        transform: (box: Box, meta: { index: number; isFirst: boolean; isLast: boolean }) => T
    ): T[] {
        const result: T[] = [];
        const entries = Array.from(this.boxes.entries());

        for (let index = 0; index < entries.length; index++) {
            const [, box] = entries[index];
            const isFirst = index === 0;
            const isLast = index === entries.length - 1;
            result.push(transform(box, { index, isFirst, isLast }));
        }

        return result;
    }

    entries() {
        return this.boxes.entries();
    }

    toObject(): Record<string, BoxData> {
        const obj: Record<string, BoxData> = {};
        for (const [id, box] of this.boxes) {
            obj[id] = box.toObject();
        }
        return obj;
    }
}
