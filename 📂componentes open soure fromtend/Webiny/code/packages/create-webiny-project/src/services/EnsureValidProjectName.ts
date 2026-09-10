import validateNpmPkgName from "validate-npm-package-name";
import chalk from "chalk";

const { red, green } = chalk;

export class EnsureValidProjectName {
    execute(projectName: string) {
        const validationResult = validateNpmPkgName(projectName);
        if (!validationResult.validForNewPackages) {
            console.error(
                red(
                    `Cannot create a project named ${green(
                        `"${projectName}"`
                    )} because of npm naming restrictions:\n`
                )
            );
            [...(validationResult.errors || []), ...(validationResult.warnings || [])].forEach(
                error => {
                    console.error(red(`  * ${error}`));
                }
            );
            console.error(red("\nPlease choose a different project name."));
            process.exit(1);
        }
    }
}
