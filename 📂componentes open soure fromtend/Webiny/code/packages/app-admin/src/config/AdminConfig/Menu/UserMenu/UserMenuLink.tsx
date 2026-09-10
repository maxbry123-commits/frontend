import {
    UserMenuLink as BaseUserMenuLink,
    UserMenuLinkIcon as BaseUserMenuLinkIcon
} from "~/base/ui/UserMenu/UserMenuLink.js";

const UserMenuLink = Object.assign(BaseUserMenuLink, {
    Icon: BaseUserMenuLinkIcon
});

export { UserMenuLink };
