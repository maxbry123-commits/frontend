import React from "react";
import { ReactComponent as NotificationsIconActive } from "@webiny/icons/notifications_active.svg";
import { Icon as BaseIcon } from "~/Icon/index.js";

const ToastNotificationIcon = (
    <BaseIcon
        icon={<NotificationsIconActive />}
        label={"Notification"}
        size={"md"}
        color={"accent"}
    />
);

type ToastIconProps = {
    icon?: React.ReactElement<typeof BaseIcon>;
};

const ToastIcon = ({ icon }: ToastIconProps) => {
    return (
        <span>
            {React.isValidElement(icon)
                ? React.cloneElement(icon, { ...ToastNotificationIcon.props, ...icon.props })
                : React.cloneElement(ToastNotificationIcon)}
        </span>
    );
};

export { ToastIcon, type ToastIconProps };
