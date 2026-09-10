import merge from "lodash/merge.js";
import type { PulumiApp } from "@webiny/pulumi";
import type { ServiceManifest, TableDefinition } from "./addServiceManifestTableItem.js";
import { addServiceManifestTableItem } from "./addServiceManifestTableItem.js";
import { CoreOutput } from "~/pulumi/apps/index.js";

export interface WithServiceManifest {
    addServiceManifest(manifest: ServiceManifest): void;
}

interface ApplyManifests {
    (manifests: ServiceManifest[]): void;
}

const defaultApplyManifests = (app: PulumiApp, manifests: ServiceManifest[]) => {
    const core = app.getModule(CoreOutput);

    const table: TableDefinition = {
        tableName: core.primaryDynamodbTableName,
        hashKey: core.primaryDynamodbTableHashKey,
        rangeKey: core.primaryDynamodbTableRangeKey
    };

    manifests.forEach(manifest => addServiceManifestTableItem(app, table, manifest));
};

/**
 * Augment the given app with `addServiceManifest` functionality.
 * @param {PulumiApp} app
 */
export function withServiceManifest<T extends PulumiApp>(
    app: T,
    applyManifests?: ApplyManifests
): T & WithServiceManifest {
    const manifests: Record<string, ServiceManifest> = {};

    function addServiceManifest(manifest: ServiceManifest) {
        manifests[manifest.name] = merge({}, manifests[manifest.name], manifest);
    }

    app.decorateProgram<{ addServiceManifest: typeof addServiceManifest }>(async (program, app) => {
        const output = await program({
            ...app,
            addServiceManifest
        });

        app.addHandler(() => {
            if (!applyManifests) {
                defaultApplyManifests(app, Object.values(manifests));
                return;
            }

            applyManifests(Object.values(manifests));
        });

        return output;
    });

    // Augment the original PulumiApp.
    return {
        ...app,
        addServiceManifest
    };
}
