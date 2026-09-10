import type { PathType } from "./PathType.js";

export type PathOption = {
    value: string;
    label: string;
    type: PathType;
};

export class StatePathsCollection {
    private readonly items: PathOption[];

    constructor(items: PathOption[]) {
        this.items = items;
    }

    public map(callback: (item: PathOption, index: number) => any): StatePathsCollection {
        const mapped = this.items.map(callback);
        return new StatePathsCollection(mapped);
    }

    public filter(callback: (item: PathOption, index: number) => boolean): StatePathsCollection {
        const filtered = this.items.filter(callback);
        return new StatePathsCollection(filtered);
    }

    public filterScalars(): StatePathsCollection {
        const filtered = this.items.filter(item => {
            return item.type.isScalar();
        });
        return new StatePathsCollection(filtered);
    }

    public filterArray(): StatePathsCollection {
        const filtered = this.items.filter(item => {
            return item.type.isArray();
        });
        return new StatePathsCollection(filtered);
    }

    public sort(compareFn?: (a: PathOption, b: PathOption) => number): StatePathsCollection {
        const sorted = [...this.items];

        if (compareFn) {
            sorted.sort(compareFn);
        } else {
            sorted.sort((a, b) => {
                return a.label.localeCompare(b.label);
            });
        }

        return new StatePathsCollection(sorted);
    }

    public values(): PathOption[] {
        return [...this.items];
    }
}
