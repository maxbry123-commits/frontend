import { ROOT_FOLDER } from "~/constants.js";

export class Path {
    static create(slug: string, parentPath?: string) {
        if (parentPath) {
            return `${parentPath}/${slug}`;
        }

        return `${ROOT_FOLDER}/${slug}`;
    }
}
