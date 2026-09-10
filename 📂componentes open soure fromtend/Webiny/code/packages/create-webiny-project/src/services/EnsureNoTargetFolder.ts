import fs from "fs-extra";
import chalk from "chalk";
import { CliParams } from "../types.js";
import { GetProjectRootPath } from "./GetProjectRootPath.js";

const { red } = chalk;

export class EnsureNoTargetFolder {
    execute(cliArgs: CliParams) {
        const getProjectRootPath = new GetProjectRootPath();
        const projectRootPath = getProjectRootPath.execute(cliArgs);

        const { force, projectName } = cliArgs;
        if (fs.existsSync(projectRootPath)) {
            if (!force) {
                console.log(
                    `Cannot continue because the target folder ${red(projectName)} already exists.`
                );
                console.log(
                    `If you still wish to proceed, run the same command with the ${red(
                        "--force"
                    )} flag.`
                );
                process.exit(1);
            }
        }
    }
}
