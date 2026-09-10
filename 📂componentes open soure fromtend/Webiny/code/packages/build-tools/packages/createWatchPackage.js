import watchPackage from "./watchPackage.js";
import { prepareOptions } from "../utils.js";

export default config => async options => {
    const preparedOptions = prepareOptions({ config, options });
    return watchPackage(preparedOptions);
};
