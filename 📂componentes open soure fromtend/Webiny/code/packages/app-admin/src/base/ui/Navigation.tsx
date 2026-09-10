import React from "react";
import { createVoidComponent, makeDecoratable } from "@webiny/app";
import { Tags, useTags } from "~/base/ui/Tags.js";

export const useIsInNavigation = () => {
    const { location } = useTags();
    return location === "navigation";
};

export const Navigation = makeDecoratable("Navigation", () => {
    return (
        <Tags tags={{ location: "navigation" }}>
            <NavigationRenderer />
        </Tags>
    );
});

export const NavigationRenderer = makeDecoratable("NavigationRenderer", createVoidComponent());
