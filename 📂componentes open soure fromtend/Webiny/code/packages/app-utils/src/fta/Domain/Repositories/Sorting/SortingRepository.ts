import { makeAutoObservable } from "mobx";
import type { ISortingRepository } from "./ISortingRepository.js";
import type { Sorting } from "~/fta/Domain/Models/index.js";

export class SortingRepository implements ISortingRepository {
    private sorting: Sorting[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    get() {
        return this.sorting;
    }

    async set(sorts: Sorting[]) {
        this.sorting = sorts;
    }
}
