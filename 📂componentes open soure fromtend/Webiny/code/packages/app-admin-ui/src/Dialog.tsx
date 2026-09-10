import React from "react";
import { Provider } from "@webiny/app-admin";
import { DialogProvider } from "./Dialog/DialogProvider.js";

// This implements the global dialog, which is controlled via the
// `useDialog` hook (`packages/app-admin/src/hooks/useDialog.ts`).
export const Dialog = () => {
    return <Provider hoc={DialogProvider} />;
};
