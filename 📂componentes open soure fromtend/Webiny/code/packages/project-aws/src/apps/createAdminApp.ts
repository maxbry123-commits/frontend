export function createAdminApp() {
    return {
        id: "admin",
        name: "Admin",
        description: "Your project's admin area.",
        async getPulumi() {
            const { createAdminPulumiApp } = await import("~/pulumi/index.js");

            return createAdminPulumiApp();
        }
    };
}
