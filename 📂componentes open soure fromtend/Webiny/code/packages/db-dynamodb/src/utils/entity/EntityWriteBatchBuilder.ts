import type { Entity } from "~/toolbox.js";
import type { BatchWriteItem, IDeleteBatchItem, IPutBatchItem } from "~/utils/batch/types.js";
import type { IEntityWriteBatchBuilder } from "./types.js";
import type { EntityOption } from "./getEntity.js";
import { getEntity } from "./getEntity.js";

export class EntityWriteBatchBuilder implements IEntityWriteBatchBuilder {
    private readonly entity: Entity;

    public constructor(entity: EntityOption) {
        this.entity = getEntity(entity);
    }

    public put<T extends Record<string, any>>(item: IPutBatchItem<T>): BatchWriteItem {
        return this.entity.putBatch(item, {
            execute: true,
            strictSchemaCheck: false
        });
    }

    public delete(item: IDeleteBatchItem): BatchWriteItem {
        return this.entity.deleteBatch(item);
    }
}

export const createEntityWriteBatchBuilder = (entity: Entity): IEntityWriteBatchBuilder => {
    return new EntityWriteBatchBuilder(entity);
};
