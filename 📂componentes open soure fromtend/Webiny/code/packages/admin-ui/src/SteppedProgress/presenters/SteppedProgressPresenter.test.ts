import { SteppedProgressPresenter } from "./SteppedProgressPresenter.js";
import { ProgressItemState } from "../domains/index.js";
import { describe, expect, it } from "vitest";

describe("SteppedProgressPresenter", () => {
    it("should return the compatible `vm` based on props", () => {
        const presenter = new SteppedProgressPresenter();

        // `items`
        {
            presenter.init({
                items: [
                    {
                        label: "Step 1"
                    }
                ]
            });

            expect(presenter.vm.items).toEqual([
                {
                    id: expect.any(String),
                    label: "Step 1",
                    disabled: false,
                    errored: false,
                    state: ProgressItemState.IDLE
                }
            ]);
        }

        // `items` disabled
        {
            presenter.init({
                items: [
                    {
                        label: "Step 1",
                        disabled: true
                    }
                ]
            });

            expect(presenter.vm.items).toEqual([
                {
                    id: expect.any(String),
                    label: "Step 1",
                    disabled: true,
                    errored: false,
                    state: ProgressItemState.IDLE
                }
            ]);
        }

        // `items` errored
        {
            presenter.init({
                items: [
                    {
                        label: "Step 1",
                        errored: true
                    }
                ]
            });

            expect(presenter.vm.items).toEqual([
                {
                    id: expect.any(String),
                    label: "Step 1",
                    disabled: false,
                    errored: true,
                    state: ProgressItemState.IDLE
                }
            ]);
        }

        // `items` state
        {
            presenter.init({
                items: [
                    {
                        label: "Step 1",
                        state: ProgressItemState.IN_PROGRESS
                    }
                ]
            });

            expect(presenter.vm.items).toEqual([
                {
                    id: expect.any(String),
                    label: "Step 1",
                    disabled: false,
                    errored: false,
                    state: ProgressItemState.IN_PROGRESS
                }
            ]);
        }
    });
});
