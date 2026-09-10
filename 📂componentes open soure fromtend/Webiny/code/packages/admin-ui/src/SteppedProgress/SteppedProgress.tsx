import React from "react";
import type { ProgressItemParams } from "./domains/index.js";
import { SteppedProgressItem } from "~/SteppedProgress/SteppedProgressItem.js";
import { makeDecoratable, withStaticProps } from "~/utils.js";
import { useSteppedProgress } from "~/SteppedProgress/useSteppedProgress.js";

interface SteppedProgressProps extends React.HTMLAttributes<HTMLDivElement> {
    items: ProgressItemParams[];
}

const DecoratableSteppedProgress = ({ items, ...props }: SteppedProgressProps) => {
    const { vm } = useSteppedProgress({ items });

    return (
        <div {...props}>
            {vm.items.map(item => (
                <SteppedProgressItem key={item.id} {...item} />
            ))}
        </div>
    );
};

const BaseSteppedProgress = makeDecoratable("SteppedProgress", DecoratableSteppedProgress);

const SteppedProgress = withStaticProps(BaseSteppedProgress, {
    Item: SteppedProgressItem
});

export { SteppedProgress, type SteppedProgressProps };
