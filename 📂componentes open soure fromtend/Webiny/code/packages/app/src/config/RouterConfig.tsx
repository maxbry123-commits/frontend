import { createConfigurableComponent } from "@webiny/react-properties";
import { Route, type RouteConfig } from "./RouterConfig/Route.js";

const base = createConfigurableComponent<RouterConfig>("RouterConfig");

export const RouterWithConfig = Object.assign(base.WithConfig, {
    displayName: "RouterWithConfig"
});

interface RouterConfig {
    routes: RouteConfig[];
}

export const useRouterConfig = () => {
    const baseConfig = base.useConfig();

    return {
        routes: baseConfig.routes ?? []
    };
};

export const RouterConfig = Object.assign(base.Config, {
    Route,
    useRouterConfig
});
