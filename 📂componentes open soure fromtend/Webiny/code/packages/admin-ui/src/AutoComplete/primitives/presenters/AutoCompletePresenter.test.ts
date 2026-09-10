import { AutoCompletePresenter } from "./AutoCompletePresenter.js";
import { AutoCompleteInputPresenter } from "./AutoCompleteInputPresenter.js";
import { AutoCompleteListOptionsPresenter } from "./AutoCompleteListOptionsPresenter.js";
import { describe, expect, it, vi } from "vitest";

describe("AutoCompletePresenter", () => {
    const inputPresenter = new AutoCompleteInputPresenter();
    const optionsListPresenter = new AutoCompleteListOptionsPresenter();
    const presenter = new AutoCompletePresenter(inputPresenter, optionsListPresenter);
    const onValueChange = vi.fn();

    it("should return the compatible `vm.inputVm` based on params", () => {
        // `placeholder`
        {
            presenter.init({ onValueChange });
            presenter.initInput({ placeholder: "Custom placeholder" });
            expect(presenter.vm.inputVm.placeholder).toEqual("Custom placeholder");
        }

        {
            // default: no params
            presenter.init({ onValueChange });
            presenter.initInput({});
            expect(presenter.vm.inputVm.placeholder).toEqual("Start typing or select");
            expect(presenter.vm.inputVm.displayResetAction).toEqual(false);
        }
    });

    it("should return the compatible `vm.optionsListVm` based on params", () => {
        // with `options` as string
        {
            presenter.init({ onValueChange, options: ["Option 1", "Option 2"] });
            expect(presenter.vm.optionsListVm.options).toEqual([
                {
                    value: "Option 1",
                    label: "Option 1",
                    disabled: false,
                    selected: false,
                    separator: false,
                    item: null
                },
                {
                    value: "Option 2",
                    label: "Option 2",
                    disabled: false,
                    selected: false,
                    separator: false,
                    item: null
                }
            ]);
            expect(presenter.vm.optionsListVm.empty).toEqual(false);
        }

        // with `options` as formatted options
        {
            presenter.init({
                onValueChange,
                options: [
                    {
                        value: "option-1",
                        label: "Option 1"
                    },
                    {
                        value: "option-2",
                        label: "Option 2"
                    },
                    {
                        value: "option-3",
                        label: "Option 3",
                        disabled: true
                    },
                    {
                        value: "option-4",
                        label: "Option 4",
                        separator: true
                    },
                    {
                        value: "option-5",
                        label: "Option 5",
                        item: {
                            anyKey1: "custom-value",
                            anyKey2: 2
                        }
                    }
                ]
            });

            expect(presenter.vm.optionsListVm.options).toEqual([
                {
                    value: "option-1",
                    label: "Option 1",
                    disabled: false,
                    selected: false,
                    separator: false,
                    item: null
                },
                {
                    value: "option-2",
                    label: "Option 2",
                    disabled: false,
                    selected: false, // `selected` is overwritten by the presenter
                    separator: false,
                    item: null
                },
                {
                    value: "option-3",
                    label: "Option 3",
                    disabled: true,
                    selected: false,
                    separator: false,
                    item: null
                },
                {
                    value: "option-4",
                    label: "Option 4",
                    disabled: false,
                    selected: false,
                    separator: true,
                    item: null
                },
                {
                    value: "option-5",
                    label: "Option 5",
                    disabled: false,
                    selected: false,
                    separator: false,
                    item: {
                        anyKey1: "custom-value",
                        anyKey2: 2
                    }
                }
            ]);
            expect(presenter.vm.optionsListVm.empty).toEqual(false);
        }

        // with `options` and `value`
        {
            presenter.init({ onValueChange, options: ["Option 1", "Option 2"], value: "Option 1" });
            expect(presenter.vm.optionsListVm.options).toEqual([
                {
                    value: "Option 1",
                    label: "Option 1",
                    disabled: false,
                    selected: true,
                    separator: false,
                    item: null
                },
                {
                    value: "Option 2",
                    label: "Option 2",
                    disabled: false,
                    selected: false,
                    separator: false,
                    item: null
                }
            ]);
            expect(presenter.vm.optionsListVm.empty).toEqual(false);
        }

        {
            // default: no params
            presenter.init({ onValueChange });
            expect(presenter.vm.optionsListVm.options).toEqual([]);
            expect(presenter.vm.optionsListVm.emptyMessage).toEqual(
                "Start typing to find an option."
            );
            expect(presenter.vm.optionsListVm.loadingMessage).toEqual("Loading...");
            expect(presenter.vm.optionsListVm.open).toEqual(false);
            expect(presenter.vm.optionsListVm.empty).toEqual(true);
        }
    });

    it("should change the `options` state and call `onValueChange` callback when `setSelectedOption` is called", () => {
        presenter.init({
            onValueChange,
            options: [
                {
                    label: "Option 1",
                    value: "option-1"
                },
                {
                    label: "Option 2",
                    value: "option-2"
                }
            ]
        });

        expect(presenter.vm.optionsListVm.options).toEqual([
            {
                label: "Option 1",
                value: "option-1",
                disabled: false,
                selected: false,
                separator: false,
                item: null
            },
            {
                label: "Option 2",
                value: "option-2",
                disabled: false,
                selected: false,
                separator: false,
                item: null
            }
        ]);

        presenter.setSelectedOption("option-2");
        expect(onValueChange).toHaveBeenCalledWith("option-2");
        expect(presenter.vm.optionsListVm.options).toEqual([
            {
                label: "Option 1",
                value: "option-1",
                disabled: false,
                selected: false,
                separator: false,
                item: null
            },
            {
                label: "Option 2",
                value: "option-2",
                disabled: false,
                selected: true,
                separator: false,
                item: null
            }
        ]);
    });

    it("should set the internal `inputValue` when `setInputValue` is called", () => {
        presenter.init({
            onValueChange
        });

        presenter.searchOption("value");
        expect(presenter.vm.inputVm.value).toEqual("value");
        expect(presenter.vm.inputVm.displayResetAction).toEqual(true);
    });

    it("should set the option as `selected` when the presenter is initialized with a value", () => {
        presenter.init({
            onValueChange,
            value: "option-1",
            options: [
                {
                    label: "Option 1",
                    value: "option-1"
                },
                {
                    label: "Option 2",
                    value: "option-2"
                }
            ]
        });

        presenter.initInput({
            value: "option-1"
        });

        expect(presenter.vm.optionsListVm.options).toEqual([
            {
                label: "Option 1",
                value: "option-1",
                disabled: false,
                selected: true,
                separator: false,
                item: null
            },
            {
                label: "Option 2",
                value: "option-2",
                disabled: false,
                selected: false,
                separator: false,
                item: null
            }
        ]);
        expect(presenter.vm.inputVm.value).toEqual("Option 1");
    });

    it("should reset the internal `options` state call `onValueChange` and `onValueReset` callbacks when `resetValue` is called", () => {
        const onValueReset = vi.fn();
        presenter.init({
            onValueChange,
            onValueReset,
            options: [
                {
                    label: "Option 1",
                    value: "option-1"
                },
                {
                    label: "Option 2",
                    value: "option-2"
                }
            ]
        });

        expect(presenter.vm.optionsListVm.options).toEqual([
            {
                label: "Option 1",
                value: "option-1",
                disabled: false,
                selected: false,
                separator: false,
                item: null
            },
            {
                label: "Option 2",
                value: "option-2",
                disabled: false,
                selected: false,
                separator: false,
                item: null
            }
        ]);

        presenter.setSelectedOption("option-1");
        expect(presenter.vm.optionsListVm.options).toEqual([
            {
                label: "Option 1",
                value: "option-1",
                disabled: false,
                selected: true,
                separator: false,
                item: null
            },
            {
                label: "Option 2",
                value: "option-2",
                disabled: false,
                selected: false,
                separator: false,
                item: null
            }
        ]);
        expect(presenter.vm.inputVm.value).toEqual("Option 1");

        presenter.resetSelectedOption();
        expect(presenter.vm.optionsListVm.options).toEqual([
            {
                label: "Option 1",
                value: "option-1",
                disabled: false,
                selected: false,
                separator: false,
                item: null
            },
            {
                label: "Option 2",
                value: "option-2",
                disabled: false,
                selected: false,
                separator: false,
                item: null
            }
        ]);
        expect(presenter.vm.inputVm.value).toEqual("");

        expect(onValueChange).toHaveBeenCalledWith("");
        expect(onValueReset).toHaveBeenCalled();
    });

    it("should change `optionsListVm` and call `onOpenChange` when `setListOpenState` is called", () => {
        const onOpenChange = vi.fn();

        // let's open it
        presenter.init({ onValueChange, onOpenChange });
        presenter.setListOpenState(true);
        expect(presenter.vm.optionsListVm.open).toBe(true);
        expect(onOpenChange).toHaveBeenCalledWith(true);

        // let's close it
        presenter.setListOpenState(false);
        expect(presenter.vm.optionsListVm.open).toBe(false);
        expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("should not display the reset action if `displayResetAction` is set to `false` and option is selected", () => {
        presenter.init({
            onValueChange,
            options: [
                {
                    label: "Option 1",
                    value: "option-1"
                },
                {
                    label: "Option 2",
                    value: "option-2"
                }
            ]
        });

        presenter.initInput({ displayResetAction: false });

        presenter.setSelectedOption("option-2");
        expect(onValueChange).toHaveBeenCalledWith("option-2");
        // `displayResetAction` is set to `false` and option is selected
        expect(presenter.vm.inputVm.displayResetAction).toEqual(false);
        expect(presenter.vm.optionsListVm.options).toEqual([
            {
                label: "Option 1",
                value: "option-1",
                disabled: false,
                selected: false,
                separator: false,
                item: null
            },
            {
                label: "Option 2",
                value: "option-2",
                disabled: false,
                selected: true,
                separator: false,
                item: null
            }
        ]);
    });
});
