import type { IconPickerIconDto } from "./IconPickerIconDto.js";

export class IconPickerIcon {
    private readonly _prefix: string;
    private readonly _name: string;

    protected constructor(data: { prefix: string; name: string }) {
        this._prefix = data.prefix;
        this._name = data.name;
    }

    static create(data: IconPickerIconDto) {
        return new IconPickerIcon({
            prefix: data.prefix,
            name: data.name
        });
    }

    static createFromString(value?: string) {
        if (typeof value === "string" && value.includes("/")) {
            const values = value.split("/");
            return new IconPickerIcon({
                prefix: values[0],
                name: values[1]
            });
        } else {
            return new IconPickerIcon({
                prefix: "fas",
                name: "star"
            });
        }
    }

    get prefix() {
        return this._prefix;
    }

    get name() {
        return this._name;
    }
}
