import { WcpGqlClient } from "./WcpGqlClient.js";
import { LoggerService } from "~/abstractions/index.js";
import { IWcpUserPatDto } from "~/abstractions/models/index.js";

const GET_USER_PAT = /* GraphQL */ `
    query GetUserPat($token: ID!) {
        users {
            getUserPat(token: $token) {
                name
                meta
                token
                expiresOn
                user {
                    email
                }
            }
        }
    }
`;

interface GetUserPatResponse {
    users: {
        getUserPat: IWcpUserPatDto | null;
    };
}

export interface GetUserPatDi {
    loggerService: LoggerService.Interface;
}

export class GetUserPat {
    di: GetUserPatDi;

    constructor(di: GetUserPatDi) {
        this.di = di;
    }

    async execute(pat: string) {
        const { loggerService } = this.di;
        return WcpGqlClient.execute<GetUserPatResponse>(
            GET_USER_PAT,
            { token: pat },
            { authorization: pat }
        )
            .then(({ users }) => users.getUserPat)
            .catch(err => {
                loggerService.error(
                    { pat, err },
                    "Could not use the provided %s PAT because of the following error"
                );

                throw new Error(`Invalid PAT received.`);
            });
    }
}
