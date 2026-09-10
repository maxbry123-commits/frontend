import { createGetEnv } from "~/pulumi/env/base.js";

export const getEnvVariableWebinyProjectName = createGetEnv({
    name: "WEBINY_PROJECT_NAME"
});
