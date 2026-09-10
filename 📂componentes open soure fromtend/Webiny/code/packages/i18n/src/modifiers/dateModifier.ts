import type { Modifier, ModifierOptions } from "~/types.js";

export default ({ i18n }: ModifierOptions): Modifier => ({
    name: "date",
    execute(value) {
        return i18n.date(value);
    }
});
