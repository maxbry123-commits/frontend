import type { BaseActionConfig } from "./BaseAction.js";
import type { ButtonActionType } from "./ButtonAction.js";
import { ButtonAction } from "./ButtonAction.js";
import type { MenuItemActionType } from "./MenuItemAction.js";
import { MenuItemAction } from "./MenuItemAction.js";

export type ActionsConfig = (
    | BaseActionConfig<ButtonActionType>
    | BaseActionConfig<MenuItemActionType>
)[];

export const Actions = {
    ButtonAction,
    MenuItemAction
};
