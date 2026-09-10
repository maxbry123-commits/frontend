import React from "react";
import { makeDecoratable } from "@webiny/react-composition";
import { Property, useIdGenerator } from "@webiny/react-properties";
import type { Route as BaseRoute } from "~/router.js";

export interface RouteProps {
    route: BaseRoute<any>;
    element: React.ReactElement;
    remove?: boolean;
    before?: string;
    after?: string;
}

export type RouteConfig = Pick<RouteProps, "route" | "element">;

export const Route = makeDecoratable(
    "Route",
    ({ route, element, remove, before, after }: RouteProps) => {
        const name = route.name;

        const getId = useIdGenerator("Route");

        const placeAfter = after !== undefined ? getId(after) : undefined;
        const placeBefore = before !== undefined ? getId(before) : undefined;

        return (
            <Property
                id={getId(name)}
                name={"routes"}
                remove={remove}
                array={true}
                before={placeBefore}
                after={placeAfter}
            >
                <Property id={getId(name, "route")} name={"route"} value={route} />
                <Property id={getId(name, "element")} name={"element"} value={element} />
            </Property>
        );
    }
);
