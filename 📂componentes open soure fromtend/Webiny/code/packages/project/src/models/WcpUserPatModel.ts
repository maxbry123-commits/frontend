import { type IWcpUserPatModel, type IWcpUserPatDto } from "~/abstractions/models/index.js";

export class WcpUserPatModel implements IWcpUserPatModel {
    name: string;
    meta: Record<string, any>;
    token: string;
    expiresOn: string | null;
    user: {
        email: string;
    };

    private constructor(dto: IWcpUserPatDto) {
        this.name = dto.name;
        this.meta = dto.meta;
        this.token = dto.token;
        this.expiresOn = dto.expiresOn;
        this.user = dto.user;
    }

    static fromDto(dto: IWcpUserPatDto): WcpUserPatModel {
        return new WcpUserPatModel(dto);
    }
}
