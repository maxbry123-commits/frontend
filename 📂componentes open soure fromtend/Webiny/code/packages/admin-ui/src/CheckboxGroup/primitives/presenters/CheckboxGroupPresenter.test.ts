import { CheckboxGroupPresenter } from "./CheckboxGroupPresenter.js";
import type { CheckboxItemDto } from "~/Checkbox/domains/CheckboxItemDto.js";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("CheckboxGroupPresenter", () => {
    let presenter: CheckboxGroupPresenter;
    const onCheckedChange = vi.fn();

    beforeEach(() => {
        presenter = new CheckboxGroupPresenter();
    });

    it("initializes with given props", () => {
        const mockProps = {
            items: [
                { value: "item1", label: "Item 1" },
                { value: "item2", label: "Item 2" }
            ],
            values: ["item1"],
            onCheckedChange
        };
        presenter.init(mockProps);

        expect(presenter.vm.items).toEqual([
            {
                id: expect.any(String),
                value: "item1",
                label: "Item 1",
                checked: true,
                indeterminate: false,
                disabled: false,
                hasLabel: true
            },
            {
                id: expect.any(String),
                value: "item2",
                label: "Item 2",
                checked: false,
                indeterminate: false,
                disabled: false,
                hasLabel: true
            }
        ]);
    });

    it("updates checked state when changeChecked is called", () => {
        const mockProps = {
            items: [
                { value: "item1", label: "Item 1" },
                { value: "item2", label: "Item 2" }
            ],
            values: ["item1"],
            onCheckedChange
        };
        presenter.init(mockProps);

        presenter.changeChecked("item2");

        expect(presenter.vm.items).toEqual([
            {
                id: expect.any(String),
                value: "item1",
                label: "Item 1",
                checked: true,
                indeterminate: false,
                disabled: false,
                hasLabel: true
            },
            {
                id: expect.any(String),
                value: "item2",
                label: "Item 2",
                checked: true,
                indeterminate: false,
                disabled: false,
                hasLabel: true
            }
        ]);
        expect(mockProps.onCheckedChange).toHaveBeenCalledWith(["item1", "item2"]);
    });

    it("removes an item from checked state when changeChecked is called on an already checked item", () => {
        const mockProps = {
            items: [
                {
                    id: expect.any(String),
                    value: "item1",
                    label: "Item 1",
                    checked: true,
                    indeterminate: false,
                    disabled: false,
                    hasLabel: true
                },
                {
                    id: expect.any(String),
                    value: "item2",
                    label: "Item 2",
                    checked: true,
                    indeterminate: false,
                    disabled: false,
                    hasLabel: true
                }
            ],
            values: ["item1", "item2"],
            onCheckedChange
        };
        presenter.init(mockProps);

        presenter.changeChecked("item2");

        expect(presenter.vm.items).toEqual([
            {
                id: expect.any(String),
                value: "item1",
                label: "Item 1",
                checked: true,
                indeterminate: false,
                disabled: false,
                hasLabel: true
            },
            {
                id: expect.any(String),
                value: "item2",
                label: "Item 2",
                checked: false,
                indeterminate: false,
                disabled: false,
                hasLabel: true
            }
        ]);
        expect(mockProps.onCheckedChange).toHaveBeenCalledWith(["item1"]);
    });

    it("handles items with missing values correctly", () => {
        const mockProps = {
            items: [
                { value: "item1", label: "Item 1" },
                { label: "Item 2" } // Missing `value`
            ] as unknown as CheckboxItemDto[], // Simulate improper data
            values: ["item1"],
            onCheckedChange
        };
        presenter.init(mockProps);

        expect(presenter.vm.items).toEqual([
            {
                id: expect.any(String),
                value: "item1",
                label: "Item 1",
                checked: true,
                indeterminate: false,
                disabled: false,
                hasLabel: true
            },
            {
                id: expect.any(String),
                value: undefined,
                label: "Item 2",
                checked: false,
                indeterminate: false,
                disabled: false,
                hasLabel: true
            }
        ]);
    });
});
