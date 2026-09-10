import React from "react";
import BackButton from "./BackButton.js";
import SaveContentModelButton from "./SaveContentModelButton.js";
import CreateContentButton from "./CreateContentButton.js";
import { Name } from "./Name/index.js";
import { FormSettingsButton } from "./FormSettings/index.js";

export default [
    {
        name: "content-model-editor-default-bar-right-create-content-button",
        type: "content-model-editor-default-bar-right",
        render() {
            return <CreateContentButton />;
        }
    },
    {
        name: "content-model-editor-default-bar-right-form-settings-button",
        type: "content-model-editor-default-bar-right",
        render() {
            return <FormSettingsButton />;
        }
    },
    {
        name: "content-model-editor-default-bar-right-save-button",
        type: "content-model-editor-default-bar-right",
        render() {
            return <SaveContentModelButton />;
        }
    },

    {
        name: "content-model-editor-default-bar-left-back-button",
        type: "content-model-editor-default-bar-left",
        render() {
            return <BackButton />;
        }
    },

    {
        name: "content-model-editor-default-bar-left-name",
        type: "content-model-editor-default-bar-left",
        render() {
            return <Name />;
        }
    }
];
