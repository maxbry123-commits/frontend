import type { IResolvedDomains } from "../types.js";
import { createOriginId } from "./createOriginId.js";

export interface ICreateCloudFrontFunctionDomainMapParamsResult {
    /**
     * Name of the deployment (eg. green, blue, orange, etc.).
     */
    name: string;
    sourceDomain: string;
    targetOriginId: string;
    targetDomain: string;
}

export interface ICreateCloudFrontFunctionDomainMapParams {
    domains: IResolvedDomains;
}

export const createCloudFrontFunctionDomainMap = (
    params: ICreateCloudFrontFunctionDomainMapParams
): ICreateCloudFrontFunctionDomainMapParamsResult[] => {
    const { domains } = params;

    const results: ICreateCloudFrontFunctionDomainMapParamsResult[] = [];
    for (const domain of domains) {
        for (const source of domain.sources) {
            results.push({
                name: domain.name,
                sourceDomain: source,
                targetDomain: domain.target,
                targetOriginId: createOriginId({
                    type: domain.type,
                    name: domain.name
                })
            });
        }
    }
    return results;
};
