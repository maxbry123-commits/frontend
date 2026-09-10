import type {
    CmsGroupImportResult,
    CmsModelImportResult,
    ValidCmsGroupResult,
    ValidCmsModelResult
} from "~/export/types.js";
import type { CmsContext } from "~/types/index.js";
import { importGroups } from "./importGroups.js";
import { importModels } from "./importModels.js";

interface Params {
    context: CmsContext;
    groups: ValidCmsGroupResult[];
    models: ValidCmsModelResult[];
}

interface Response {
    groups: CmsGroupImportResult[];
    models: CmsModelImportResult[];
    error?: string;
}

interface GetGroupParams {
    validated: ValidCmsGroupResult[];
    imported: CmsGroupImportResult[];
    target: string;
}

const getGroup = (params: GetGroupParams) => {
    const { validated, imported, target } = params;
    const group = imported.find(group => {
        return group.group.id === target;
    });
    if (group) {
        return group.group.id;
    }
    const validatedGroup = validated.find(group => {
        return group.group.id === target || group.target === target;
    });
    return validatedGroup?.target || validatedGroup?.group.id;
};

export const importData = async (params: Params): Promise<Response> => {
    const { context } = params;

    const groups = await importGroups(params);

    const models = await importModels({
        context,
        models: params.models.map(model => {
            const group = getGroup({
                validated: params.groups,
                imported: groups,
                target: model.model.group
            });
            return {
                ...model,
                group: group || model.model.group
            };
        })
    });

    return {
        groups,
        models
    };
};
