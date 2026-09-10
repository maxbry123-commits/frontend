import type { FilterDTO } from "../domain/index.js";
import type {
    CreateFilterPayload,
    UpdateFilterPayload
} from "~/components/AdvancedSearch/gateways/filters.types.js";

export interface FiltersGatewayInterface {
    list: (namespace: string) => Promise<FilterDTO[]>;
    get: (id: string) => Promise<FilterDTO>;
    create: (filter: CreateFilterPayload) => Promise<FilterDTO>;
    update: (filter: UpdateFilterPayload) => Promise<FilterDTO>;
    delete: (id: string) => Promise<boolean>;
}
