import { getWcpGqlApiUrl } from "@webiny/wcp";
import { request } from "graphql-request";

export class WcpGqlClient {
    static execute<TData extends Record<string, any> = Record<string, any>>(
        query: string,
        variables: Record<string, any> = {},
        headers: HeadersInit = {}
    ) {
        const wcpApiUrl = getWcpGqlApiUrl();
        return request(wcpApiUrl, query, variables, headers) as Promise<TData>;
    }
}
