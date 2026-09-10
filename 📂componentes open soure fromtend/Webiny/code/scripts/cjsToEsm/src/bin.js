import "tsx";
import path from "path";

const rootFolder = process.argv[2];
const shouldTransformProject = process.argv.includes("--transform");

if (shouldTransformProject) {
    console.log("Transforming project to ESM...");
    const { cjsToEsm } = await import("./cjsToEsm.js");
    if (rootFolder && rootFolder !== "all") {
        const absolutePath = path.resolve(rootFolder);
        await cjsToEsm(absolutePath);
    } else {
        await cjsToEsm();
    }
}
