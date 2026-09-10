import * as React from "react";
import { CenteredView, DashboardRenderer } from "@webiny/app-admin";
import Welcome from "./Dashboard/Welcome.js";

export const Dashboard = DashboardRenderer.createDecorator(() => {
    return function DashboardRenderer() {
        return (
            <CenteredView>
                <Welcome />
            </CenteredView>
        );
    };
});
