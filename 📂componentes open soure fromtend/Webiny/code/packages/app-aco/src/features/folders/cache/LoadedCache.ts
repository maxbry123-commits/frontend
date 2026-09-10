import { makeAutoObservable, runInAction } from "mobx";

export interface IListLoadedCachePredicate {
    (item: string): boolean;
}

export class LoadedCache {
    private state: string[];

    constructor() {
        this.state = [];

        makeAutoObservable(this);
    }

    hasItems() {
        return this.state.length > 0;
    }

    clear() {
        runInAction(() => {
            this.state = [];
        });
    }

    count() {
        return this.state.length;
    }

    getItems() {
        return [...this.state];
    }

    getItem(predicate: IListLoadedCachePredicate) {
        return this.state.find(item => predicate(item));
    }

    addItems(items: string[]) {
        runInAction(() => {
            this.state = Array.from(new Set([...this.state, ...items]));
        });
    }
}
