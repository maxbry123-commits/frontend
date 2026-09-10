import { type IAppPackageModel } from "~/abstractions/models/index.js";

type AppPackageModelDto = IAppPackageModel;

export class AppPackageModel implements IAppPackageModel {
    public name: string;

    public paths: IAppPackageModel["paths"];

    public packageJson: Record<string, any>;

    private constructor(dto: AppPackageModelDto) {
        this.name = dto.name;
        this.paths = dto.paths;
        this.packageJson = dto.packageJson;
    }

    static fromDto(dto: AppPackageModelDto) {
        return new AppPackageModel(dto);
    }
}
