import type { ActionConfig } from "./Action.js";
import { Action } from "./Action.js";

export interface RecordConfig {
    actions: ActionConfig[];
}

export const Record = {
    Action
};
