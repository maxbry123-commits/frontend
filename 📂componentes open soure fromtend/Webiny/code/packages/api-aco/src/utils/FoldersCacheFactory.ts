import type { Folder } from "~/folder/folder.types.js";
import { ListCache } from "~/utils/ListCache.js";

export class FoldersCacheFactory {
    private cache: Map<string, ListCache<Folder>> = new Map();

    hasCache(namespace: string) {
        const cacheKey = this.getCacheKey(namespace);
        return this.cache.has(cacheKey);
    }

    getCache(namespace: string) {
        const cacheKey = this.getCacheKey(namespace);

        if (!this.cache.has(cacheKey)) {
            this.cache.set(cacheKey, new ListCache<Folder>());
        }

        return this.cache.get(cacheKey) as ListCache<Folder>;
    }

    deleteCache() {
        this.cache.clear();
    }

    private getCacheKey(namespace: string) {
        return namespace;
    }
}

export const folderCacheFactory = new FoldersCacheFactory();
