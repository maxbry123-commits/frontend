import chalk from "chalk";
import { CliParams } from "../types.js";

const { bold, gray } = chalk;

const HL = bold(gray("—")).repeat(30);

export class PrintErrorInfo {
    execute(err: Error, cliArgs: CliParams) {
        const { debug } = cliArgs;
        console.log(["", `${bold("Error Logs")}`, HL, err.message, debug && err.stack].join("\n"));
    }
}
