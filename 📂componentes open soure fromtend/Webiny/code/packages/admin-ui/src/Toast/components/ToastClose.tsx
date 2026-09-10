import React from "react";
import { ReactComponent as CloseIcon } from "@webiny/icons/close.svg";
import { IconButton, type IconButtonProps } from "~/Button/index.js";
import { Icon } from "~/Icon/index.js";

type ToastCloseProps = IconButtonProps;

const ToastClose = (props: ToastCloseProps) => (
    <IconButton
        icon={<Icon label={"Close"} icon={<CloseIcon />} />}
        size={"sm"}
        iconSize={"lg"}
        {...props}
    />
);

export { ToastClose, type ToastCloseProps };
