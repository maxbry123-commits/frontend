export interface IEcommerceSettings {
    [key: string]: any;
}

export type AllEcommerceSettings = {
    [integrationName: string]: IEcommerceSettings;
};
