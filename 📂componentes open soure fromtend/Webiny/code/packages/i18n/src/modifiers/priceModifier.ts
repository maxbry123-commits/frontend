import type { Modifier, ModifierOptions } from "~/types.js";

export default ({ i18n }: ModifierOptions): Modifier => ({
    name: "price",
    execute(value: string) {
        return i18n.price(value);
    }
});
