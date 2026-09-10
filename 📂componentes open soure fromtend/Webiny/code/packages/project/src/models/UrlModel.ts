import { type IUrlModel, type IUrlModelDto } from "~/abstractions/models/index.js";

export class UrlModel implements IUrlModel {
    constructor(private value: string) {}

    join(...paths: string[]) {
        const joinedPath = [this.value, ...paths].join("");
        return UrlModel.from(joinedPath);
    }

    toString(): string {
        return this.value;
    }

    toDto(): IUrlModelDto {
        return { value: this.value };
    }

    static from(value: string | IUrlModelDto | UrlModel): UrlModel {
        if (value instanceof UrlModel) {
            return value;
        }

        if (typeof value === "string") {
            return new UrlModel(value);
        }

        return new UrlModel(value.value);
    }
}
