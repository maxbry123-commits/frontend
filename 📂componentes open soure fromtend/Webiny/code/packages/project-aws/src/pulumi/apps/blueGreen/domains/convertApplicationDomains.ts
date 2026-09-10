import type { IGetApplicationStacksResult } from "./getApplicationDomains.js";
import type { IDeploymentDomain, IDeploymentsDomains } from "../types.js";

export interface IConvertApplicationDomainsParams {
    input: IGetApplicationStacksResult;
}

export const convertApplicationDomains = (
    params: IConvertApplicationDomainsParams
): IDeploymentsDomains => {
    const { input } = params;

    const result = Object.keys(input).map<IDeploymentDomain>(name => {
        const value = input[name];
        return {
            name,
            env: value.env,
            variant: value.variant,
            domains: {
                api: value.api,
                admin: value.admin
            }
        };
    });
    if (result.length !== 2) {
        throw new Error("Invalid number of domains.");
    }
    return result as IDeploymentsDomains;
};
