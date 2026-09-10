import { SwitchPresenter } from "./SwitchPresenter.js";
import { describe, expect, it, vi } from "vitest";

describe("SwitchPresenter", () => {
    const onChange = vi.fn();

    it("should return the compatible `switchVm` based on props", () => {
        const presenter = new SwitchPresenter();

        // `label`
        {
            presenter.init({ onChange, label: "Label" });
            expect(presenter.vm.item?.label).toEqual("Label");
        }

        // `checked`
        {
            presenter.init({ onChange, label: "Label", checked: true });
            expect(presenter.vm.item?.checked).toEqual(true);
        }

        // `value`
        {
            presenter.init({ onChange, label: "Label", value: "any" });
            expect(presenter.vm.item?.value).toEqual("any");
            expect(presenter.vm.item?.checked).toEqual(true);
        }

        // `disabled`
        {
            presenter.init({ onChange, label: "Label", disabled: true });
            expect(presenter.vm.item?.disabled).toEqual(true);
        }

        // default: only mandatory props
        {
            presenter.init({ onChange, label: "Label" });
            expect(presenter.vm.item).toEqual({
                id: expect.any(String),
                label: "Label",
                checked: false,
                disabled: false
            });
        }
    });

    it("should call `onChange` callback when `changeValue` is called", () => {
        const presenter = new SwitchPresenter();
        presenter.init({ onChange, label: "Label" });
        presenter.changeChecked(true);
        expect(onChange).toHaveBeenCalledWith(true);
    });
});
