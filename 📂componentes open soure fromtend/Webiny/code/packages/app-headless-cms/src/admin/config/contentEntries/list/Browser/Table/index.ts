import type { ColumnConfig } from "./Column.js";
import { Column } from "./Column.js";

export interface TableConfig {
    columns: ColumnConfig[];
}

export const Table = {
    Column
};
