import { SystemRequirements } from "@webiny/system-requirements";
import chalk from "chalk";
import { GetCwpVersion } from "./GetCwpVersion.js";
import { CliParams } from "../types.js";

const { bold, gray } = chalk;

const NOT_APPLICABLE = gray("N/A");
const HL = bold(gray("—")).repeat(30);

export class PrintSystemInfo {
    execute(cliArgs: CliParams) {
        const node = SystemRequirements.getNodeVersion();
        const os = SystemRequirements.getOsVersion();

        let npm = NOT_APPLICABLE;
        try {
            npm = SystemRequirements.getNpmVersion();
        } catch {}

        let npx = NOT_APPLICABLE;
        try {
            npx = SystemRequirements.getNpxVersion();
        } catch {}

        let yarn = NOT_APPLICABLE;
        try {
            yarn = SystemRequirements.getYarnVersion();
        } catch {}

        let cwpVersion = NOT_APPLICABLE;
        try {
            const getCwpVersion = new GetCwpVersion();
            cwpVersion = getCwpVersion.execute();
        } catch {}

        const { templateOptions } = cliArgs;

        console.log(
            [
                `${bold("System Information")}`,
                HL,
                `create-webiny-project: ${cwpVersion}`,
                `Operating System: ${os}`,
                `Node: ${node}`,
                `Yarn: ${yarn}`,
                `Npm: ${npm}`,
                `Npx: ${npx}`,
                `Template Options: ${templateOptions}`,
                "",
                "Please open an issue including the error output at https://github.com/webiny/webiny-js/issues/new.",
                "You can also get in touch with us on our Slack Community: https://www.webiny.com/slack",
                ""
            ].join("\n")
        );
    }
}
