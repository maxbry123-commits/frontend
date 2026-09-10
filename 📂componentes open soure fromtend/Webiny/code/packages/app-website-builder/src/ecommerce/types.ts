export type Image = {
    width?: number;
    height?: number;
    src: string;
};

export type Resource = {
    id: string | number;
    title: string;
    handle?: string;
    image?: Image;
};

export interface IEcommerceApi {
    [resourceName: string]: {
        findById(id: string): Promise<Resource>;
        findByHandle?(handle: string): Promise<Resource>;
        search(search: string, offset?: number, limit?: number): Promise<Resource[]>;
        getRequestObject(id: string, resource?: Resource): string;
    };
}

export interface IEcommerceApiFactory {
    (settings: any): Promise<IEcommerceApi> | IEcommerceApi;
}

export type BaseInput<T = any> = {
    type: string;
    name: string;
    defaultValue?: T;
    label?: string;
    description?: string;
    note?: string;
    required?: boolean;
};

export type TextInput = BaseInput<string> & {
    type: "text";
    placeholder?: string;
};

export type NumberInput = BaseInput<number> & {
    type: "number";
    min?: number;
    max?: number;
};

export type BooleanInput = BaseInput<boolean> & {
    type: "boolean";
    required?: never;
};

export type SelectInput = BaseInput<string> & {
    type: "select";
    options: { label: string; value: string }[];
};

export type SettingsInput = TextInput | SelectInput | NumberInput | BooleanInput;
