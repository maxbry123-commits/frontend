import { JsonObject } from "type-fest";
import { WcpGqlClient } from "~/services/WcpService/WcpGqlClient.js";
import { WcpUserModel } from "~/models/index.js";
import { LocalStorageService } from "~/abstractions/index.js";
import { GetPatFromLocalStorage } from "./GetPatFromLocalStorage.js";

const GET_CURRENT_USER = /* GraphQL */ `
    query GetUser {
        users {
            getCurrentUser {
                id
                email
                firstName
                lastName
            }
        }
    }
`;

interface GetCurrentUserResponse extends JsonObject {
    users: {
        getCurrentUser: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
    };
}

const LIST_ORGS = /* GraphQL */ `
    query ListOrgs {
        orgs {
            listOrgs {
                data {
                    id
                    name
                }
            }
        }
    }
`;

interface ListOrgsResponse extends JsonObject {
    orgs: {
        listOrgs: {
            data: Array<{
                id: string;
                name: string;
                projects: Array<{
                    id: string;
                    name: string;
                    org: {
                        id: string;
                        name: string;
                    };
                }>;
            }>;
        };
    };
}

const LIST_PROJECTS = /* GraphQL */ `
    query ListProjects($orgId: ID!) {
        projects {
            listProjects(orgId: $orgId) {
                data {
                    id
                    name
                    org {
                        id
                        name
                    }
                }
            }
        }
    }
`;

interface ListProjectsResponse extends JsonObject {
    projects: {
        listProjects: {
            data: Array<{
                id: string;
                name: string;
                org: {
                    id: string;
                    name: string;
                };
            }>;
        };
    };
}

export interface IGetUserDi {
    localStorageService: LocalStorageService.Interface;
}

export class GetUser {
    cachedUser: WcpUserModel | null = null;
    di: IGetUserDi;

    constructor(di: IGetUserDi) {
        this.di = di;
    }

    async execute() {
        if (this.cachedUser) {
            return this.cachedUser;
        }

        const getPatFromLocalStorage = new GetPatFromLocalStorage({
            localStorageService: this.di.localStorageService
        });

        const pat = getPatFromLocalStorage.execute();

        if (!pat) {
            throw new Error(
                `It seems you are not logged into your WCP project. Please log in using the "yarn webiny login"
                command.`
            );
        }

        const gqlClient = WcpGqlClient;

        try {
            const headers = { authorization: pat };
            this.cachedUser = await gqlClient
                .execute<GetCurrentUserResponse>(GET_CURRENT_USER, {}, headers)
                .then(async response => {
                    const user = response.users.getCurrentUser;

                    const orgs = await gqlClient
                        .execute<ListOrgsResponse>(LIST_ORGS, {}, headers)
                        .then(async response => {
                            const orgs = response.orgs.listOrgs.data;
                            for (let i = 0; i < orgs.length; i++) {
                                const org = orgs[i];
                                org.projects = await gqlClient
                                    .execute<ListProjectsResponse>(
                                        LIST_PROJECTS,
                                        { orgId: org.id },
                                        headers
                                    )
                                    .then(response => response.projects.listProjects.data);
                            }
                            return orgs;
                        });

                    const projects = orgs.map(org => org.projects).flat();

                    return WcpUserModel.fromDto({ ...user, orgs, projects });
                });
        } catch {
            throw new Error(
                `It seems the personal access token is incorrect or does not exist. Please log out and log in again using the "yarn webiny login" command.`
            );
        }

        return this.cachedUser;
    }
}
