import zod from "zod";
import { createZodError } from "@webiny/utils/createZodError.js";
import type { IBlueGreenDeployment } from "../types.js";

const schema = zod
    .array(
        zod.object({
            name: zod.string(),
            env: zod.string(),
            variant: zod.string().optional()
        })
    )
    .min(2)
    .max(2)
    .refine(
        items => {
            const check = new Set(items.map(i => i.name));
            return check.size === items.length;
        },
        {
            message: "Names must be unique."
        }
    )
    .refine(
        items => {
            const checks = new Set(
                items.map(item => {
                    return `${item.env}#${item.variant || "not-set"}`;
                })
            );
            return checks.size === items.length;
        },
        {
            message: "Environment / variant combinations must be unique."
        }
    );

export const validateDeployments = (deployments: unknown): IBlueGreenDeployment[] => {
    const result = schema.safeParse(deployments);
    if (result.error) {
        throw createZodError(result.error);
    }
    return result.data.map(item => {
        return {
            ...item,
            variant: item.variant
        };
    });
};
