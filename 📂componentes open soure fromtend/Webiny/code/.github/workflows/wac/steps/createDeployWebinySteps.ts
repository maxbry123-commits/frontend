export const createDeployWebinySteps = ({ workingDirectory = "dev" } = {}) => {
    return [
        {
            name: "Deploy Core",
            "working-directory": workingDirectory,
            run: "yarn webiny deploy core --env dev"
        },
        {
            name: "Deploy API",
            "working-directory": workingDirectory,
            run: "yarn webiny deploy api --env dev"
        },
        {
            name: "Deploy Admin Area",
            "working-directory": workingDirectory,
            run: "yarn webiny deploy admin --env dev"
        }
    ];
};
