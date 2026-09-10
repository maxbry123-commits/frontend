import path from "path";
import { CliParams } from "../types.js";

export class GetProjectRootPath {
    execute(cliArgs: CliParams) {
        return path.resolve(cliArgs.projectName).replace(/\\/g, "/");
    }
}
