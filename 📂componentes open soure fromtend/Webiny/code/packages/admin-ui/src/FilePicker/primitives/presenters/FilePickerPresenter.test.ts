import { FilePickerPresenter } from "./FilePickerPresenter.js";
import { describe, expect, it } from "vitest";

describe("FilePickerPresenter", () => {
    const presenter = new FilePickerPresenter();

    it("should initialize with null file when no value is provided", () => {
        presenter.init({});
        expect(presenter.vm.file).toBeNull();
    });

    it("should initialize with a file created from URL when value is a string", () => {
        const url = "http://example.com/file.png";
        presenter.init({ value: url });
        expect(presenter.vm.file).toEqual({
            id: expect.any(String),
            name: "file.png",
            mimeType: "image/png",
            url,
            size: 0
        });
    });

    it("should initialize with a file created from URL when value is a string and the mimeType is unknown", () => {
        const url = "http://example.com/file.unknown";
        presenter.init({ value: url });
        expect(presenter.vm.file).toEqual({
            id: expect.any(String),
            name: "file.unknown",
            mimeType: "application/octet-stream",
            url,
            size: 0
        });
    });

    it("should initialize with a file created from FileItemDto when value is an object", () => {
        const fileItemDto = {
            id: "1",
            name: "file.png",
            url: "http://example.com/file.png",
            mimeType: "image/png",
            size: 1000
        };
        presenter.init({ value: fileItemDto });
        expect(presenter.vm.file).toEqual(fileItemDto);
    });
});
