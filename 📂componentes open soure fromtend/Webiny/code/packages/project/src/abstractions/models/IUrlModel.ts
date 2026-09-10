export interface IUrlModelDto {
    value: string;
}

export interface IUrlModel {
    toString(): string;
    toDto(): IUrlModelDto;
    join: (...paths: string[]) => IUrlModel;
}
