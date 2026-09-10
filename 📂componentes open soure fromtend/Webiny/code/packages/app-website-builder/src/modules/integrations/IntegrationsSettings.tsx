import React from "react";
import { Alert, Grid, Input, Select, Switch, Tabs } from "@webiny/admin-ui";
import { Bind } from "@webiny/form";
import { toTitleCaseLabel } from "~/ecommerce/components/toTitleCaseLabel.js";
import { validation } from "@webiny/validation";
import { type EcommerceApiManifest } from "~/features/index.js";

export const IntegrationsSettings = ({ manifests }: { manifests: EcommerceApiManifest[] }) => {
    if (!manifests.length) {
        return <Alert type={"info"}>There are no integrations to configure.</Alert>;
    }

    const tabs = manifests.map(manifest => {
        const name = manifest.getName();
        return (
            <Tabs.Tab
                key={name}
                trigger={toTitleCaseLabel(name)}
                value={name}
                content={<IntegrationForm manifest={manifest} />}
            />
        );
    });

    return <Tabs tabs={tabs} size={"md"} spacing={"sm"} />;
};

interface IntegrationFormProps {
    manifest: EcommerceApiManifest;
}

const IntegrationForm = ({ manifest }: IntegrationFormProps) => {
    return (
        <Grid>
            {manifest.getSettingsInputs().map(input => {
                const bindProps = {
                    name: `${manifest.getName()}.${input.name}`,
                    validators: input.required ? validation.create("required") : undefined,
                    defaultValue: input.defaultValue
                };

                const inputProps = {
                    label: input.label ?? toTitleCaseLabel(input.name),
                    description: input.description,
                    note: input.note
                };

                return (
                    <Grid.Column key={input.name} span={12}>
                        {input.type === "text" ? (
                            <Bind {...bindProps}>
                                <Input {...inputProps} />
                            </Bind>
                        ) : null}
                        {input.type === "number" ? (
                            <Bind {...bindProps}>
                                <Input type="number" {...inputProps} />
                            </Bind>
                        ) : null}
                        {input.type === "select" ? (
                            <Bind {...bindProps}>
                                <Select
                                    displayResetAction={false}
                                    options={input.options}
                                    {...inputProps}
                                />
                            </Bind>
                        ) : null}
                        {input.type === "boolean" ? (
                            <Bind {...bindProps}>
                                <Switch {...inputProps} />
                            </Bind>
                        ) : null}
                    </Grid.Column>
                );
            })}
        </Grid>
    );
};
