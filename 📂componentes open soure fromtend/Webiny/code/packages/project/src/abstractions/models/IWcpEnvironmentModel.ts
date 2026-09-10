export interface IWcpEnvironmentModel {
    id: string;
    status: string;
    name: string;
    apiKey: string;
    org: {
        id: string;
        name: string;
    };
    project: {
        id: string;
        name: string;
    };
    user: null | {
        id: string;
        email: string;
    };
}
