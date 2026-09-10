import { type PulumiAppResource, type PulumiAppResourceConstructor } from "~/PulumiAppResource.js";

export function isResourceOfType<T extends PulumiAppResourceConstructor>(
    resource: PulumiAppResource<PulumiAppResourceConstructor>,
    type: T
): resource is PulumiAppResource<T> {
    return resource.type === type;
}
