import type { ElementFactory } from "~/ElementFactory.js";
import type { InputAstNode } from "./ComponentManifestToAstConverter.js";
import type { DocumentElementBindings, Document } from "~/types.js";
import { createElement, type CreateElementParams } from "./createElement.js";
import { StylesBindingsProcessor } from "~/StylesBindingsProcessor.js";
import { InputsBindingsProcessor } from "~/InputBindingsProcessor.js";

export type FlatBindings = Record<string, Record<string, any>>;
type DeepBindings = Record<string, any>;

// The BindingsApi class manages the transformation and handling of element bindings,
// including inputs and styles, for a document element within the editor.
export class BindingsApi {
    public inputs: DeepBindings = {};
    public styles: DeepBindings = {};
    private inputsProcessor: InputsBindingsProcessor;
    private stylesProcessor: StylesBindingsProcessor;
    private breakpoint: string;
    private breakpoints: string[];

    // TODO: refactor to pass inputs and styles processor instead of their deps.

    // Constructs a new BindingsApi instance for a specific element, providing its
    // raw and resolved bindings, the input AST, an element factory, and the current breakpoint.
    constructor(
        elementId: string,
        rawBindings: DocumentElementBindings,
        resolvedBindings: DocumentElementBindings,
        inputsAst: InputAstNode[],
        elementFactory: ElementFactory,
        breakpoint: string
    ) {
        this.breakpoint = breakpoint;
        // TODO: improve handling of breakpoints.
        this.breakpoints = ["desktop", "tablet", "mobile"];
        this.inputsProcessor = new InputsBindingsProcessor(
            elementId,
            inputsAst,
            this.breakpoints,
            rawBindings,
            elementFactory
        );
        this.stylesProcessor = new StylesBindingsProcessor(
            elementId,
            this.breakpoints,
            rawBindings
        );
        this.inputs = this.inputsProcessor.toDeepInputs(resolvedBindings.inputs || {});
        this.styles = this.stylesProcessor.toDeepStyles(resolvedBindings.styles || {});
    }

    // Returns the public API for this binding context, exposing deep inputs, styles,
    // and a function to create elements.
    public getPublicApi() {
        return {
            inputs: this.inputs,
            styles: this.styles ?? {},
            createElement: (params: CreateElementParams) => {
                return createElement(params);
            }
        };
    }

    public applyToDocument(document: Document) {
        const inputs = this.inputsProcessor.createUpdate(this.inputs, this.breakpoint);
        const styles = this.stylesProcessor.createUpdate(this.styles, this.breakpoint);

        inputs.applyToDocument(document);
        styles.applyToDocument(document);
    }
}
