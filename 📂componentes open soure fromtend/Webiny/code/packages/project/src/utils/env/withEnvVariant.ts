import { createConfiguration } from "./configuration.js";

export interface IWithEnvVariantParams {
    variant?: string;
}

export const withEnvVariant = (params: IWithEnvVariantParams) => {
    return createConfiguration(() => {
        const variant = (params.variant || "").trim();
        if (!variant) {
            return;
        }
        return {
            WEBINY_ENV_VARIANT: variant
        };
    });
};
