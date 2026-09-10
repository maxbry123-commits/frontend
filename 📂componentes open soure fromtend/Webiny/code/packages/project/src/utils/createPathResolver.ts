import path from "path";

export const createPathResolver = (...cwd: string[]) => {
    return (...pathParts: string[]) => {
        return path.join(path.join(...cwd), ...pathParts);
    };
};
