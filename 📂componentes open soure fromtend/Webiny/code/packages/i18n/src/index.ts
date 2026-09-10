import I18n from "./I18n.js";
import defaultProcessor from "./processors/default.js";
import modifiersFactory from "./modifiers/index.js";

const i18n = new I18n();

const defaultModifiers = modifiersFactory({ i18n });

export default i18n;

export { I18n, defaultModifiers, defaultProcessor };
