export type { IDocumentOperation } from "./IDocumentOperation.js";
import { AddElement } from "./AddElement.js";
import { AddToParent } from "./AddToParent.js";
import { RemoveElement } from "./RemoveElement.js";
import { SetGlobalInputBinding } from "./SetGlobalInputBinding.js";
import { SetGlobalStyleBinding } from "./SetGlobalStyleBinding.js";
import { SetInputBindingOverride } from "./SetInputBindingOverride.js";
import { SetStyleBindingOverride } from "./SetStyleBindingOverride.js";

export const DocumentOperations = {
    AddElement,
    AddToParent,
    RemoveElement,
    SetGlobalInputBinding,
    SetGlobalStyleBinding,
    SetInputBindingOverride,
    SetStyleBindingOverride
};
