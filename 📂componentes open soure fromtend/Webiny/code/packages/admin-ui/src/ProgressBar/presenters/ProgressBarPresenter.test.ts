import { describe, expect, it } from "vitest";
import { ProgressBarPresenter } from "./ProgressBarPresenter.js";

describe("ProgressBarPresenter", () => {
    const presenter = new ProgressBarPresenter();

    it("should initialize with default values", () => {
        presenter.init({});
        expect(presenter.vm.value).toBe(0);
        expect(presenter.vm.textValue).toBe("0%");
        expect(presenter.vm.min).toBe(0);
        expect(presenter.vm.textMin).toBe("0");
        expect(presenter.vm.max).toBe(100);
        expect(presenter.vm.textMax).toBe("100");
    });

    it("should initialize with custom values", () => {
        presenter.init({ value: 50, max: 200 });
        expect(presenter.vm.value).toBe(50);
        expect(presenter.vm.textValue).toBe("25%");
        expect(presenter.vm.max).toBe(200);
        expect(presenter.vm.textMax).toBe("200");
    });

    it("should use custom getValueLabel function", () => {
        const getValueLabel = (value: number, max: number) => `${value}/${max}`;
        presenter.init({ value: 30, max: 150, getValueLabel });
        expect(presenter.vm.textValue).toBe("30/150");
    });

    it("should handle null and undefined values gracefully", () => {
        presenter.init({ value: null, max: undefined });
        expect(presenter.vm.value).toBe(0);
        expect(presenter.vm.max).toBe(100);
        expect(presenter.vm.textValue).toBe("0%");
    });
});
