import { createPreset } from "../createPreset";

export const vitest = createPreset(() => {
    return {
        name: "vitest",
        matching: /vitest/,
        skipResolutions: true
    };
});
