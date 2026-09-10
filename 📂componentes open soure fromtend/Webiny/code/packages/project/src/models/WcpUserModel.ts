import { type IWcpUserModel, type IWcpUserDto } from "~/abstractions/models/index.js";

export class WcpUserModel implements IWcpUserModel {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    orgs: Array<{ id: string; name: string }>;
    projects: Array<{ id: string; name: string; org: { id: string; name: string } }>;

    private constructor(dto: IWcpUserDto) {
        this.id = dto.id;
        this.email = dto.email;
        this.firstName = dto.firstName;
        this.lastName = dto.lastName;
        this.orgs = dto.orgs;
        this.projects = dto.projects;
    }

    static fromDto(dto: IWcpUserDto): IWcpUserModel {
        return new WcpUserModel(dto);
    }
}
