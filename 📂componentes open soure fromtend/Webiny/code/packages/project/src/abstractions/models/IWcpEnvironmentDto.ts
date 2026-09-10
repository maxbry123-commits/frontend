export interface IWcpEnvironmentDto {
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
    user: {
        id: string;
        email: string;
    };
}
