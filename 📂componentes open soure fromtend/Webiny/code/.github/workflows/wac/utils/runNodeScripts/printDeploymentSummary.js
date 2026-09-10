// This script can only be run if we previously checked out the project and installed all dependencies.
const args = process.argv.slice(2); // Removes the first two elements
const [cwd] = args;

import { exec } from "node:child_process";

exec(
    "yarn webiny output admin --env dev --json",
    (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            process.exit(1);
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            process.exit(1);
        }

        const adminStackOutput = JSON.parse(stdout);
        console.log(`### Deployment Summary
| App | URL |
|-|----|
| Admin Area | [${adminStackOutput.appUrl}](${adminStackOutput.appUrl}) |
`);
    },
    { cwd }
);
