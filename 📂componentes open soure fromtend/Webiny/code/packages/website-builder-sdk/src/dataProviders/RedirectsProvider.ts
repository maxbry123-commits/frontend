import type { ApiClient } from "./ApiClient.js";
import type { IRedirects } from "~/IRedirects.js";
import type { PublicRedirect } from "~/types.js";

export class RedirectsProvider implements IRedirects {
    private redirectsCache: Map<string, PublicRedirect> | undefined = undefined;
    private apiClient: ApiClient;

    constructor(apiClient: ApiClient) {
        this.apiClient = apiClient;
    }

    async getRedirectByPath(path: string): Promise<PublicRedirect | undefined> {
        await this.populateCache();

        if (!this.redirectsCache) {
            return undefined;
        }

        return this.redirectsCache.get(path);
    }

    async getAllRedirects(): Promise<Map<string, PublicRedirect>> {
        await this.populateCache();
        return this.redirectsCache ?? new Map();
    }

    private async populateCache() {
        const redirects: PublicRedirect[] = await this.apiClient.fetch({
            path: "/wb/redirects",
            cache: "no-cache",
            next: {
                revalidate: 0
            }
        });

        this.redirectsCache = new Map();
        for (const redirect of redirects) {
            this.redirectsCache.set(redirect.from, redirect);
        }
    }
}
