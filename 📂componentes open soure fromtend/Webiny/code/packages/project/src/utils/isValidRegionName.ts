import { ok, err, type Result } from "neverthrow";
import { regions } from "./regions.js";

export const isValidRegionName = (name?: string): Result<string, string> => {
    const region = (name || "").trim();

    // Empty is considered valid (same as your original logic)
    if (!region) {
        return ok(region);
    }

    const exists = regions.some(item => item.value === region);
    if (exists) {
        return ok(region);
    }

    return err(
        `Region "${region}" is not recognized. Valid regions are: ${regions
            .map(r => `"${r.value}"`)
            .join(", ")}.`
    );
};
