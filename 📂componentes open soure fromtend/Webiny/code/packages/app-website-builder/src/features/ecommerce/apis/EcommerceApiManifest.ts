import type { IEcommerceApiFactory, SettingsInput } from "~/ecommerce/index.js";

export class EcommerceApiManifest {
    private readonly name: string;
    private readonly api: IEcommerceApiFactory;
    private readonly inputs: SettingsInput[];

    constructor(name: string, api: IEcommerceApiFactory, inputs: SettingsInput[]) {
        this.name = name;
        this.api = api;
        this.inputs = inputs;
    }

    getName() {
        return this.name;
    }

    async getApi(settings: Record<string, any>) {
        return this.api(settings);
    }

    getSettingsInputs() {
        return this.inputs;
    }
}
