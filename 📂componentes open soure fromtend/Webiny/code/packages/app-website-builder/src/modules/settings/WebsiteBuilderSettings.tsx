import { Grid, Input } from "@webiny/admin-ui";
import React from "react";
import { Bind } from "@webiny/form";

export const WebsiteBuilderSettings = () => {
    return (
        <Grid>
            <Grid.Column span={12}>
                <Bind name={"previewDomain"}>
                    <Input
                        label={"Preview Domain"}
                        description={"This domain will be used in the page editor."}
                    />
                </Bind>
            </Grid.Column>
        </Grid>
    );
};
