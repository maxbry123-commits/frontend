export { CoreOutput, configureAdminCognitoFederation } from "~/pulumi/index.js";

export function createCoreApp() {
    return {
        id: "core",
        name: "Core",
        description: "Your project's stateful cloud infrastructure resources.",
        async getPulumi() {
            const { createCorePulumiApp } = await import("~/pulumi/index.js");

            return createCorePulumiApp();
        }
    };
}
