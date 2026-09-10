import { createPreset } from "../createPreset";

export const storybook = createPreset(() => {
    return {
        name: "storybook",
        matching: /storybook/,
        skipResolutions: true,
        caret: true
    };
});
