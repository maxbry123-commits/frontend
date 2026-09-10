import {
    UserMenuItem as BaseUserMenuItem,
    UserMenuItemIcon as BaseUserMenuItemIcon
} from "~/base/ui/UserMenu/UserMenuItem.js";

const UserMenuItem = Object.assign(BaseUserMenuItem, {
    Icon: BaseUserMenuItemIcon
});

export { UserMenuItem };
