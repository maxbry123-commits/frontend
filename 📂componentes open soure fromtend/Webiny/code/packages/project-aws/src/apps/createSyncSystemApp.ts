import { createSyncSystemPulumiApp } from "~/pulumi/apps/syncSystem/createSyncSystemPulumiApp.js";

export function createSyncSystemApp() {
    return {
        id: "sync",
        name: "Sync System",
        description: "Your project's Sync System.",
        pulumi: createSyncSystemPulumiApp()
    };
}
