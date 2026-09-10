import { StorageOpsId } from "./types.js";

export abstract class AbstractStorageOps {
    abstract readonly id: StorageOpsId;
    abstract readonly shortId: string;
    abstract readonly displayName: string;
}
