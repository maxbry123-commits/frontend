import { customAlphabet } from "nanoid";
const nanoid = customAlphabet("1234567890abcdef");
import type { Property } from "./Properties.js";

const sortPropertiesToTheTop = (a: Property, b: Property) => {
    if (a.$isFirst && b.$isFirst) {
        return -1;
    }

    return Number(b.$isFirst) - Number(a.$isFirst);
};

const sortPropertiesToTheBottom = (a: Property, b: Property) => {
    if (a.$isLast && b.$isLast) {
        return 1;
    }

    return Number(a.$isLast) - Number(b.$isLast);
};

const sortProperties = (properties: Property[]) => {
    return properties.sort(sortPropertiesToTheTop).sort(sortPropertiesToTheBottom);
};

function buildRoots(roots: Property[], properties: Property[]) {
    const sortedRoots = sortProperties(roots);
    const obj: Record<string, unknown> = sortedRoots.reduce((acc, item) => {
        const isArray =
            item.array === true || sortedRoots.filter(r => r.name === item.name).length > 1;
        return { ...acc, [item.name]: isArray ? [] : {} };
    }, {});

    sortedRoots.forEach(root => {
        const isArray = root.array === true || Array.isArray(obj[root.name]);
        if (root.value !== undefined) {
            obj[root.name] = isArray ? [...(obj[root.name] as Array<any>), root.value] : root.value;
            return;
        }

        const nextRoots = properties.filter(p => p.parent === root.id);
        const value = buildRoots(nextRoots, properties);
        obj[root.name] = isArray ? [...(obj[root.name] as Property[]), value] : value;
    });

    return obj;
}

export function toObject<T = unknown>(properties: Property[]): T {
    const roots = properties.filter(prop => prop.parent === "");
    return buildRoots(roots, properties) as T;
}

export function getUniqueId(length = 12) {
    return nanoid(length);
}
