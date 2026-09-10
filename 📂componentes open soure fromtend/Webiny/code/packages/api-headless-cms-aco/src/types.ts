import type { AcoContext } from "@webiny/api-aco/types.js";
import type { CmsContext } from "@webiny/api-headless-cms/types/index.js";
import type { Context as BaseContext } from "@webiny/handler/types.js";

export interface HcmsAcoContext extends BaseContext, AcoContext, CmsContext {}
