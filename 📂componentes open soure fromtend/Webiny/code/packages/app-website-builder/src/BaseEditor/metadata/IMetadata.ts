import type { Document } from "@webiny/website-builder-sdk";

export type Metadata = Record<string, any>;

export interface IMetadata {
    get<T = unknown>(id: string): T | undefined;
    set(id: string, data: any): void;
    unset(id?: string): void;
    applyToDocument(document: Document): void;
}
