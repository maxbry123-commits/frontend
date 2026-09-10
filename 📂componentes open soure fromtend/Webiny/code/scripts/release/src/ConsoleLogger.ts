import chalk from "chalk";

const logColors = {
    log: chalk.white,
    info: chalk.blueBright,
    error: chalk.red,
    warning: chalk.yellow,
    debug: chalk.gray,
    success: chalk.green
};

const colorizePlaceholders = (type: keyof typeof logColors, string: string) => {
    return string.replace(/\%[a-zA-Z]/g, match => {
        return logColors[type](match);
    });
};

const log = (type: keyof typeof logColors, ...args: any[]) => {
    const prefix = `webiny ${logColors[type](type)}: `;

    const [first, ...rest] = args;
    if (typeof first === "string") {
        return console.log(prefix + colorizePlaceholders(type, first), ...rest);
    }
    return console.log(prefix, first, ...rest);
};

export class ConsoleLogger {
    log(...args: any[]) {
        log("log", ...args);
    }

    info(...args: any[]) {
        log("info", ...args);
    }

    success(...args: any[]) {
        log("success", ...args);
    }

    debug(...args: any[]) {
        log("debug", ...args);
    }

    warning(...args: any[]) {
        log("warning", ...args);
    }

    error(...args: any[]) {
        log("error", ...args);
    }
}
