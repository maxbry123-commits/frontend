import type { Modifier, ModifierOptions } from "~/types.js";

export default ({ i18n }: ModifierOptions): Modifier => ({
    name: "time",
    execute(value: string) {
        return i18n.time(value);
    }
});
