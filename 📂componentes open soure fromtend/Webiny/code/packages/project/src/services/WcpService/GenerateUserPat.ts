import { WcpGqlClient } from "./WcpGqlClient.js";
import { JsonObject } from "type-fest";
import { LoggerService } from "~/abstractions/index.js";

const GENERATE_USER_PAT = /* GraphQL */ `
    mutation GenerateUserPat {
        users {
            generateUserPat
        }
    }
`;

export interface GenerateUserPatResponse extends JsonObject {
    users: {
        generateUserPat: string;
    };
}

export interface GetUserPatDi {
    loggerService: LoggerService.Interface;
}

export class GenerateUserPat {
    di: GetUserPatDi;

    constructor(di: GetUserPatDi) {
        this.di = di;
    }

    async execute() {
        const { loggerService } = this.di;

        return WcpGqlClient.execute<GenerateUserPatResponse>(GENERATE_USER_PAT)
            .then(({ users }) => users.generateUserPat)
            .catch(err => {
                loggerService.error(
                    { err },
                    "Could not generate a temporary PAT because of the following error"
                );
                throw new Error(`Could not generate a temporary PAT!`);
            });
    }
}
