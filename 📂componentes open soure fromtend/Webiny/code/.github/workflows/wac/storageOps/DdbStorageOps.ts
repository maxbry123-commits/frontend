import { AbstractStorageOps } from "./AbstractStorageOps.js";

export class DdbStorageOps extends AbstractStorageOps {
    id = "ddb" as const;
    shortId = "ddb";
    displayName = "DDB";
}
