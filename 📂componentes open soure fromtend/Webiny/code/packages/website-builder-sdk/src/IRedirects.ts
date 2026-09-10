import type { PublicRedirect } from "~/types.js";

export interface IRedirects {
    getAllRedirects(): Promise<Map<string, PublicRedirect>>;
    getRedirectByPath(path: string): Promise<PublicRedirect | undefined>;
}
