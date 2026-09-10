import type { Entity } from "~/toolbox.js";
import type { GenericRecord } from "@webiny/api/types.js";

export type IPutParamsItem<T extends GenericRecord = GenericRecord> = {
    PK: string;
    SK: string;
    [key: string]: any;
} & T;

export interface IPutParams<T extends GenericRecord = GenericRecord> {
    entity: Entity;
    item: IPutParamsItem<T>;
}

export const put = async <T extends GenericRecord = GenericRecord>(params: IPutParams<T>) => {
    const { entity, item } = params;

    return await entity.put(item, {
        execute: true,
        strictSchemaCheck: false
    });
};
