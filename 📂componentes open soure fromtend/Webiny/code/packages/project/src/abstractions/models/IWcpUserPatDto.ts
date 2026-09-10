export interface IWcpUserPatDto {
    name: string;
    meta: Record<string, any>;
    token: string;
    expiresOn: string | null;
    user: {
        email: string;
    };
}
