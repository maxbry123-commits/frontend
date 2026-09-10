import { buildPackages } from "./buildPackages";

(async () => {
    await buildPackages();
    process.exit();
})();
