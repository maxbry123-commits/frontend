import React from "react";
import { makeDecoratable } from "@webiny/app-admin";
import { Layout } from "./Layout.js";
import { Elements as BaseElements } from "../Elements.js";
import type { ElementProps as BaseElementProps } from "../Element.js";
import { Element as BaseElement } from "../Element.js";
import { createGetId } from "../createGetId.js";

const SCOPE = "content";

const BaseContent = makeDecoratable("EditorContent", () => {
    return (
        <Layout>
            <Elements />
        </Layout>
    );
});

export type ElementProps = Omit<BaseElementProps, "scope" | "group" | "id">;

const getElementId = createGetId(SCOPE)();

const Element = makeDecoratable("ContentElement", (props: ElementProps) => {
    return (
        <BaseElement
            {...props}
            scope={SCOPE}
            id={getElementId(props.name)}
            before={props.before ? getElementId(props.before) : undefined}
            after={props.after ? getElementId(props.after) : undefined}
        />
    );
});

const Elements = makeDecoratable("ContentElements", () => {
    return <BaseElements scope={SCOPE} />;
});

export const Content = Object.assign(BaseContent, { Layout, Element, Elements });
