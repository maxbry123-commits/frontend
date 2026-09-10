export class UnitsOptions {
    private units = ["px", "%", "em", "rem"];

    static widthUnits() {
        const units = new UnitsOptions();
        units.add("vw");
        return units;
    }

    static heightUnits() {
        const units = new UnitsOptions();
        units.add("vh");
        return units;
    }

    add(...args: string[]) {
        this.units.push(...args);
        return this;
    }

    remove(...args: string[]) {
        this.units = this.units.filter(unit => !args.includes(unit));
        return this;
    }

    getOptions() {
        return this.units.map(unit => ({
            label: unit,
            value: unit
        }));
    }
}
