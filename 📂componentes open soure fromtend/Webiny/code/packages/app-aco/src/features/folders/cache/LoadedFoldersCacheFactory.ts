import { LoadedCache } from "~/features/folders/cache/LoadedCache.js";

export class LoadedFoldersCacheFactory {
    private cache: Map<string, LoadedCache> = new Map();

    getCache(namespace: string) {
        const cacheKey = this.getCacheKey(namespace);

        if (!this.cache.has(cacheKey)) {
            this.cache.set(cacheKey, new LoadedCache());
        }

        return this.cache.get(cacheKey) as LoadedCache;
    }

    private getCacheKey(namespace: string) {
        return namespace;
    }
}

export const loadedFolderCacheFactory = new LoadedFoldersCacheFactory();
