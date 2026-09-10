import React from "react";
import {
    type ScrollbarProps as ReactCustomScrollbarProps,
    Scrollbars
} from "react-custom-scrollbars";

interface ScrollbarProps extends ReactCustomScrollbarProps {
    style?: React.CSSProperties;
    [key: string]: any;
}

const Scrollbar = (props: ScrollbarProps) => {
    return <Scrollbars {...props} />;
};

export { Scrollbar, type ScrollbarProps };
