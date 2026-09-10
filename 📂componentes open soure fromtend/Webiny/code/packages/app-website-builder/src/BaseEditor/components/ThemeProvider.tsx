import { createGenericContext } from "@webiny/app";
import type { WebsiteBuilderTheme } from "@webiny/website-builder-sdk";

const ThemeContext = createGenericContext<{ theme: WebsiteBuilderTheme | undefined }>(
    "WebsiteBuilderTheme"
);

export const ThemeProvider = ThemeContext.Provider;
export const useWebsiteBuilderTheme = ThemeContext.useHook;
