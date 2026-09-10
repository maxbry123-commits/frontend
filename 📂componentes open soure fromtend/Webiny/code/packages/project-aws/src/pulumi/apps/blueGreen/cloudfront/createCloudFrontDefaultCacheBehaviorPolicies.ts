import * as aws from "@pulumi/aws";
import type { GetCachePolicyResult } from "@pulumi/aws/cloudfront/getCachePolicy.js";
import type { GetOriginRequestPolicyResult } from "@pulumi/aws/cloudfront/getOriginRequestPolicy.js";

export interface ICreateCloudFrontDefaultCacheBehaviorPoliciesOutput {
    disableCachingCachePolicyId: GetCachePolicyResult;
    forwardEverythingOriginRequestPolicyId: GetOriginRequestPolicyResult;
}

export const createCloudFrontDefaultCacheBehaviorPolicies =
    async (): Promise<ICreateCloudFrontDefaultCacheBehaviorPoliciesOutput> => {
        const disableCachingCachePolicyId = await aws.cloudfront.getCachePolicy({
            name: "Managed-CachingDisabled"
        });

        const forwardEverythingOriginRequestPolicyId = await aws.cloudfront.getOriginRequestPolicy({
            name: "Managed-AllViewerExceptHostHeader"
        });
        return {
            disableCachingCachePolicyId,
            forwardEverythingOriginRequestPolicyId
        };
    };
