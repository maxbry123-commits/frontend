import { createGetEnv } from "~/pulumi/env/base.js";

export const getEnvVariableAwsRegion = createGetEnv({
    name: "AWS_REGION"
});
