export class UnitValue {
    private value: string;
    private unit: string;
    private keywords = ["auto", "unset", "inherit"];

    private constructor(valueWithUnit: string = "") {
        const [, value, unit = "px"] = valueWithUnit.match(/(\d+)?(\S+)?/) ?? [];
        if (this.isAKeyword(unit)) {
            this.value = unit;
        } else {
            this.value = value;
        }
        this.unit = unit;
    }

    static from(value: string) {
        return new UnitValue(value);
    }

    static isKeyword(unit: string): boolean {
        return new UnitValue(unit).isKeyword();
    }

    isKeyword() {
        return this.keywords.includes(String(this.value));
    }

    getValue(defaultValue?: string) {
        return this.value ? this.value.toString() : (defaultValue ?? "");
    }

    setUnit(unit: string) {
        if (this.isKeyword()) {
            this.value = "0";
        }
        this.unit = unit;
    }

    getUnit() {
        return this.unit;
    }

    toString() {
        return `${this.value}${this.unit}`;
    }

    private isAKeyword(str: string) {
        return this.keywords.includes(str);
    }
}
