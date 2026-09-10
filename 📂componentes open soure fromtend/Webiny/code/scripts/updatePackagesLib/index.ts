#!/usr/bin/env node
process.env.NODE_PATH = process.cwd();
// require("ts-node").register({
//     dir: __dirname
// });

import { presets } from "./presets/index.js";

export { updatePackages } from "./updatePackages.js";
export { getUserInput } from "./getUserInput.js";

const sortedPresets = presets.sort((a, b) => a.name.localeCompare(b.name));

export { sortedPresets as presets };
