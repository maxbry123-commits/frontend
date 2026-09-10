export type FolderAccessLevel = "owner" | "viewer" | "editor" | "public" | "no-access";

export interface FolderPermission {
    target: `admin:${string}` | `team:${string}`;
    level: FolderAccessLevel;
    inheritedFrom?: string;
}

export interface FolderLevelPermission {
    id: string;
    parentId: string;
    slug: string;
    path: string;
    permissions: FolderPermission[];
    type: string;
}
