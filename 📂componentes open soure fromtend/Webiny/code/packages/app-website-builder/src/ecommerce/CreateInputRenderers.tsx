import React from "react";
import capitalize from "lodash/capitalize.js";
import { createResourcePicker } from "./createResourcePicker.js";
import { createResourceListPicker } from "./createResourceListPicker.js";
import { Editor } from "~/index.js";
import { useEcommerceApi } from "~/features/ecommerce/apis/index.js";

const { ElementInput } = Editor.EditorConfig;

interface CreateCommerceInputRenderersProps {
    pluginName: string;
}

export const CreateInputRenderers = ({ pluginName }: CreateCommerceInputRenderersProps) => {
    const { api } = useEcommerceApi(pluginName);

    if (!api) {
        return null;
    }

    const resources = Object.keys(api);

    const inputRenderers = resources.map(resourceName => {
        return (
            <React.Fragment key={resourceName}>
                {/* Single resource. */}
                <ElementInput.Renderer
                    name={`${pluginName}/${capitalize(resourceName)}`}
                    component={createResourcePicker(pluginName, api, resourceName)}
                />
                {/* List of resources. */}
                <ElementInput.Renderer
                    name={`${pluginName}/${capitalize(resourceName)}/List`}
                    component={createResourceListPicker(pluginName, api, resourceName)}
                />
            </React.Fragment>
        );
    });

    return <>{inputRenderers}</>;
};
