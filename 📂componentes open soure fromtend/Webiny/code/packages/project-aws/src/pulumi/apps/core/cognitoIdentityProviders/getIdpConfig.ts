import type * as pulumi from "@pulumi/pulumi";
import { type CognitoIdentityProviderConfig } from "./configure.js";
import { getGoogleIdpConfig } from "./google.js";
import { getFacebookIdpConfig } from "./facebook.js";
import { getAppleIdpConfig } from "./apple.js";
import { getAmazonIdpConfig } from "./amazon.js";
import { getOidcIdpConfig } from "./oidc.js";

const idpMap = {
    google: getGoogleIdpConfig,
    facebook: getFacebookIdpConfig,
    amazon: getAmazonIdpConfig,
    apple: getAppleIdpConfig,
    oidc: getOidcIdpConfig
};

export const getIdpConfig = (
    type: CognitoIdentityProviderConfig["type"],
    userPoolId: pulumi.Input<string>,
    config: CognitoIdentityProviderConfig
) => {
    return idpMap[type](userPoolId, config);
};
