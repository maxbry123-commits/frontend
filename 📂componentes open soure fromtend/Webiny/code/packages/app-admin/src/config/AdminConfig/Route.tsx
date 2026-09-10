import React from "react";
import { Route as AppRoute } from "@webiny/app/config/RouterConfig/Route.js";
import { RouterConfig } from "@webiny/app/config/RouterConfig.js";

export const Route = (props: React.ComponentProps<typeof AppRoute>) => {
    return (
        <RouterConfig>
            <AppRoute {...props} />
        </RouterConfig>
    );
};
