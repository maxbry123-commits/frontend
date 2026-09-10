import type * as pulumi from "@pulumi/pulumi";
import { type CognitoIdentityProviderConfig } from "./configure.js";
import { type IdentityProviderArgs } from "@pulumi/aws/cognito/index.js";

export const getGoogleIdpConfig = (
    userPoolId: pulumi.Input<string>,
    config: CognitoIdentityProviderConfig
): IdentityProviderArgs => {
    return {
        userPoolId,
        providerName: "Google",
        providerType: "Google",
        providerDetails: config.providerDetails,
        idpIdentifiers: config.idpIdentifiers,
        attributeMapping: {
            "custom:id": "sub",
            username: "sub",
            email: "email",
            given_name: "given_name",
            family_name: "family_name",
            ...config.attributeMapping
        }
    };
};
