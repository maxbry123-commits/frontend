import { createContext } from "react";
import type { GenericComponent } from "~/types.js";
import { makeDecoratable } from "~/makeDecoratable.js";

const ComposableContext = createContext<string[]>([]);
ComposableContext.displayName = "ComposableContext";

const nullRenderer = () => null;

/**
 * @deprecated Use `makeDecoratable` instead.
 */
export function makeComposable<T extends GenericComponent>(name: string, Component?: T) {
    return makeDecoratable(name, Component ?? nullRenderer);
}
