import buildPackage from "./buildPackage.js";
import { prepareOptions } from "../utils.js";

export default config => async options => {
    const preparedOptions = prepareOptions({ config, options });
    return buildPackage(preparedOptions);
};
