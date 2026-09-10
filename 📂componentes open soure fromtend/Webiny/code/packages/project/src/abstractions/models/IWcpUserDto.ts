export interface IWcpUserDto {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    orgs: Array<{ id: string; name: string }>;
    projects: Array<{ id: string; name: string; org: { id: string; name: string } }>;
}
