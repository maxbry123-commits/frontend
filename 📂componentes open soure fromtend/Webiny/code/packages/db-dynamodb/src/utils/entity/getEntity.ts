import { Entity as ToolboxEntity } from "~/toolbox.js";
import type { Entity } from "./Entity.js";

export type EntityOption = ToolboxEntity | Entity;

export const getEntity = (entity: EntityOption): ToolboxEntity => {
    const result = entity instanceof ToolboxEntity ? entity : entity.entity;
    if (!result.name) {
        throw new Error(`No name provided for entity.`);
    } else if (!result.table) {
        throw new Error(`No table provided for entity ${result.name}.`);
    }
    return result;
};
