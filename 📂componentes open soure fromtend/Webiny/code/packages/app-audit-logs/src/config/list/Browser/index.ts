import type { FilterConfig } from "./Filter.js";
import { Filter } from "./Filter.js";
import type { FiltersToWhereConverter } from "./FiltersToWhere.js";
import { FiltersToWhere } from "./FiltersToWhere.js";

export interface BrowserConfig {
    filters: FilterConfig[];
    filtersToWhere: FiltersToWhereConverter[];
}

export const Browser = {
    Filter,
    FiltersToWhere
};
