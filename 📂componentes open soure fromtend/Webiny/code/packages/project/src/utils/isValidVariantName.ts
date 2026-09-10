import { ok, err, type Result } from "neverthrow";

const disallowedVariants = ["none", "empty", "blank"];

export const isValidVariantName = (name?: string): Result<string, string> => {
    if (!name) {
        return ok("Variant name is empty. Please provide a valid name.");
    }

    if (disallowedVariants.includes(name)) {
        return err(
            `Variant "${name}" is not allowed. Not allowed: ${disallowedVariants
                .map(v => `"${v}"`)
                .join(", ")}.`
        );
    }

    return ok(name);
};
