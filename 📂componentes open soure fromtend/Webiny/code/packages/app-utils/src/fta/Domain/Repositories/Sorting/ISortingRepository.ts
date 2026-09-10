import type { Sorting } from "~/fta/Domain/Models/index.js";

export interface ISortingRepository {
    set: (sorts: Sorting[]) => Promise<void>;
    get: () => Sorting[];
}
