import React from "react";
import { i18n } from "@webiny/app/i18n/index.js";
import { ResultDialogMessage } from "./DialogMessage.js";
import type { Result } from "../Worker.js";
import { useDialogs } from "~/components/Dialogs/useDialogs.js";

const t = i18n.ns("app-admin/hooks/use-dialog-with-report");

export interface ShowConfirmationDialogParams {
    execute: (() => void) | (() => Promise<void>);
    title?: string;
    message?: string;
    loadingLabel?: string;
}

export interface ShowResultsDialogParams {
    results: Result[];
    title?: string;
    message?: string;
    onCancel?: () => Promise<void>;
}

export interface UseDialogWithReportResponse {
    showConfirmationDialog: (params: ShowConfirmationDialogParams) => void;
    showResultsDialog: (results: ShowResultsDialogParams) => void;
    hideResultsDialog: () => void;
}

export const useDialogWithReport = (): UseDialogWithReportResponse => {
    const { showDialog, closeAllDialogs } = useDialogs();

    const showConfirmationDialog = ({
        execute,
        title,
        message,
        loadingLabel
    }: ShowConfirmationDialogParams) => {
        showDialog({
            title: title || t`Confirm`,
            content: message || t`Are you sure you want to continue?`,
            loadingLabel: loadingLabel || t`Processing...`,
            acceptLabel: t`Confirm`,
            onAccept: execute,
            cancelLabel: t`Cancel`
        });
    };

    const showResultsDialog = ({ title, onCancel, ...params }: ShowResultsDialogParams) => {
        setTimeout(() => {
            showDialog({
                title: title || t`Results`,
                content: <ResultDialogMessage {...params} />,
                cancelLabel: t`Close`,
                onClose: onCancel,
                acceptLabel: null
            });
        }, 10);
    };

    const hideResultsDialog = () => {
        closeAllDialogs();
    };

    return {
        showConfirmationDialog,
        showResultsDialog,
        hideResultsDialog
    };
};
