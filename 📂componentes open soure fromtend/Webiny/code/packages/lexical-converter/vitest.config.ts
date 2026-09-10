import * as path from "node:path";
import { createTestConfig } from "../../testing";

export default async () => {
    process.env.NODE_ENV = "development";

    return createTestConfig({
        path: import.meta.dirname,
        vitestConfig: {
            environment: "jsdom",
            setupFiles: [path.resolve(import.meta.dirname, "./__tests__/setup/setupEnv.ts")]
        }
    });
};
