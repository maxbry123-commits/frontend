import lodashUcFirst from "lodash/startCase.js";

export interface ICreateOriginIdParams {
    /**
     * Name of the deployment (eg. green, blue, orange, etc.).
     */
    name: string;
    /**
     * Type of the deployment (eg. api, etc.).
     */
    type: string;
}

export const createOriginId = (params: ICreateOriginIdParams): string => {
    const { type, name } = params;
    return `${type}${lodashUcFirst(name)}BlueGreenCloudFront`;
};
