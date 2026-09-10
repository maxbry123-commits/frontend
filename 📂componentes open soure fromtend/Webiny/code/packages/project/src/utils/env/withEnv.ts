import { createConfiguration } from "./configuration.js";

export interface IWithEnvParams {
    env: string;
}

export const withEnv = (params: IWithEnvParams) => {
    return createConfiguration(() => {
        return {
            WEBINY_ENV: params.env
        };
    });
};
