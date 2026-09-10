import chalk from "chalk";
import { layers } from "./layers.js";

export const getLayerArn = (name, region) => {
    if (!region) {
        // Try using AWS_REGION from environment variables as a fallback.
        region = process.env.AWS_REGION;
    }

    if (!layers[name]) {
        throw Error(
            `Layer ${chalk.red(name)} does not exist! Available layers are: ${Object.keys(layers)
                .map(k => `${chalk.green(k)}`)
                .join(", ")}`
        );
    }

    if (!layers[name][region]) {
        throw Error(`Layer ${chalk.red(name)} is not available in ${chalk.red(region)} region.`);
    }

    return layers[name][region];
};
