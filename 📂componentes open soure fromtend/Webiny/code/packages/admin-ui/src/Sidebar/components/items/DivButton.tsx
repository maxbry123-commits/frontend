import React, { useMemo } from "react";

interface DivButtonProps extends React.HTMLAttributes<HTMLDivElement> {
    disabled?: boolean;
}

const DivButton = ({ tabIndex, disabled, ...props }: DivButtonProps) => {
    const divAsButtonProps = useMemo<React.HTMLAttributes<HTMLDivElement>>(() => {
        let tabIndexToUse = typeof tabIndex === "number" ? tabIndex : 0;
        if (disabled) {
            tabIndexToUse = -1;
        }

        return {
            role: "button",
            tabIndex: tabIndexToUse,
            onKeyDown: e => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.currentTarget.click();
                }
            }
        };
    }, [disabled, tabIndex]);

    return <div {...props} {...divAsButtonProps} />;
};

export { DivButton, type DivButtonProps };
