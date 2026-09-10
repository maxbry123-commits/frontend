import { MultiFilePickerPresenter } from "./MultiFilePickerPresenter.js";
import { describe, expect, it } from "vitest";

describe("MultiFilePickerPresenter", () => {
    const presenter = new MultiFilePickerPresenter();

    it("should initialize with an empty array when no value is provided", () => {
        presenter.init({});
        expect(presenter.vm.files).toEqual([]);
        expect(presenter.vm.hasFiles).toBeFalsy();
    });

    it("should initialize with a files created from URL when values is an array of string", () => {
        const url = "http://example.com/file.png";
        presenter.init({ values: [url] });
        expect(presenter.vm.files).toEqual([
            {
                id: expect.any(String),
                name: "file.png",
                mimeType: "image/png",
                url,
                size: 0
            }
        ]);
        expect(presenter.vm.hasFiles).toBeTruthy();
    });

    it("should initialize with a file created from URL when value is a string and the mimeType is unknown", () => {
        const url = "http://example.com/file.unknown";
        presenter.init({ values: [url] });
        expect(presenter.vm.files).toEqual([
            {
                id: expect.any(String),
                name: "file.unknown",
                mimeType: "application/octet-stream",
                url,
                size: 0
            }
        ]);
        expect(presenter.vm.hasFiles).toBeTruthy();
    });

    it("should initialize with a file created from FileItemDto when value is an object", () => {
        const fileItemDto = {
            id: "1",
            name: "file.png",
            url: "http://example.com/file.png",
            mimeType: "image/png",
            size: 1000
        };
        presenter.init({ values: [fileItemDto] });
        expect(presenter.vm.files).toEqual([fileItemDto]);
        expect(presenter.vm.hasFiles).toBeTruthy();
    });
});
