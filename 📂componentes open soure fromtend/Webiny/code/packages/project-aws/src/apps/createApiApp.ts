export { ApiOutput } from "~/pulumi/index.js";

export function createApiApp() {
    return {
        id: "api",
        name: "API",
        description:
            "Represents cloud infrastructure needed for supporting your project's (GraphQL) API.",
        cli: {
            // Default args for the "yarn webiny watch ..." command.
            watch: {
                // By default, we only enable local development for the "graphql" function.
                // This can be changed down the line by passing another set of values
                // to the "watch" command.
                function: "graphql"
            }
        },
        async getPulumi() {
            const { createApiPulumiApp } = await import("~/pulumi/index.js");

            return createApiPulumiApp();
        }
    };
}
