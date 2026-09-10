import { type IListCache, ListCache } from "./ListCache.js";
import type { PageRevision } from "./PageRevision.js";

export class PageRevisionsCacheFactory {
    private cache: IListCache<PageRevision> = new ListCache<PageRevision>();

    getCache(): IListCache<PageRevision> {
        return this.cache;
    }
}

export const pageRevisionsCacheFactory = new PageRevisionsCacheFactory();
