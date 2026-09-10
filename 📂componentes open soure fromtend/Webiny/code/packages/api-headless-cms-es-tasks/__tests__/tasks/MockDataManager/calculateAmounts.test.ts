import { describe, expect, it } from "vitest";
import { calculateAmounts } from "~/tasks/MockDataManager/calculateAmounts";

describe("calculateAmounts", () => {
    it("should properly calculate the amount of tasks and records - 50", async () => {
        const values = calculateAmounts(50);

        expect(values).toEqual({
            amountOfTasks: 1,
            amountOfRecords: 50
        });
    });

    it("should properly calculate the amount of tasks and records - 9999", async () => {
        const values = calculateAmounts(9999);

        expect(values).toEqual({
            amountOfTasks: 5,
            amountOfRecords: 2000
        });
    });

    it("should properly calculate the amount of tasks and records - 10001", async () => {
        const values = calculateAmounts(10001);

        expect(values).toEqual({
            amountOfTasks: 5,
            amountOfRecords: 2000
        });
    });

    it("should properly calculate the amount of tasks and records - 25001", async () => {
        const values = calculateAmounts(25001);

        expect(values).toEqual({
            amountOfTasks: 5,
            amountOfRecords: 5000
        });
    });

    it("should properly calculate the amount of tasks and records - 99999", async () => {
        const values = calculateAmounts(99999);

        expect(values).toEqual({
            amountOfTasks: 5,
            amountOfRecords: 20000
        });
    });

    it("should fail to calculate because value is too large - 100001", async () => {
        expect.assertions(1);

        try {
            calculateAmounts(100001);
        } catch (ex) {
            expect(ex.message).toBe(`No valid value found - input value is too large: 100001.`);
        }
    });
});
