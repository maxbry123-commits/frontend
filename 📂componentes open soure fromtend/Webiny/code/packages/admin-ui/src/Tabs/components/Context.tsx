import { createContext } from "react";
import type { TabItem } from "./Tab.js";

interface ITabsContext {
    addTab(props: TabItem): void;
    removeTab(id: string): void;
}

const TabsContext = createContext<ITabsContext | undefined>(undefined);

export { TabsContext, type ITabsContext };
