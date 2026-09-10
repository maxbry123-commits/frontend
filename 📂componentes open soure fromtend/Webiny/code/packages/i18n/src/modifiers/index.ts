// Built-in modifiers
import countModifiers from "./countModifier.js";
import genderModifier from "./genderModifier.js";
import ifModifier from "./ifModifier.js";
import pluralModifier from "./pluralModifier.js";
import dateModifier from "./dateModifier.js";
import dateTimeModifier from "./dateTimeModifier.js";
import timeModifier from "./timeModifier.js";
import numberModifier from "./numberModifier.js";
import priceModifier from "./priceModifier.js";
import type { Modifier, ModifierOptions } from "~/types.js";

export default (options: ModifierOptions): Modifier[] => [
    countModifiers(),
    genderModifier(),
    ifModifier(),
    pluralModifier(),
    dateModifier(options),
    dateTimeModifier(options),
    timeModifier(options),
    numberModifier(options),
    priceModifier(options)
];
