import { WcpGqlClient } from "./WcpGqlClient.js";
import { LoggerService } from "~/abstractions/index.js";
import { WcpUserPatModel } from "~/models/index.js";
import { IWcpUserPatDto } from "~/abstractions/models/index.js";

const USER_PAT_FIELDS = /* GraphQL */ `
    fragment UserPatFields on UserPat {
        name
        meta
        token
        expiresOn
        user {
            email
        }
    }
`;

export interface CreateUserPatResponse {
    users: {
        createUserPat: IWcpUserPatDto;
    };
}

const CREATE_USER_PAT = /* GraphQL */ `
    ${USER_PAT_FIELDS}
    mutation CreateUserPat($expiresIn: Int, $token: ID, $data: CreateUserPatDataInput) {
        users {
            createUserPat(expiresIn: $expiresIn, token: $token, data: $data) {
                ...UserPatFields
            }
        }
    }
`;

export interface CreateUserPatDi {
    loggerService: LoggerService.Interface;
}

export class CreateUserPat {
    di: CreateUserPatDi;

    constructor(di: CreateUserPatDi) {
        this.di = di;
    }

    async execute(data: any, userPat: string) {
        const { loggerService } = this.di;

        return WcpGqlClient.execute<CreateUserPatResponse>(
            CREATE_USER_PAT,
            { data },
            { authorization: userPat }
        )
            .then(({ users }) => WcpUserPatModel.fromDto(users.createUserPat))
            .catch(err => {
                loggerService.error(
                    { err },
                    "Could not create a temporary PAT because of the following error"
                );
                throw new Error(`Could not create a temporary PAT!`);
            });
    }
}
