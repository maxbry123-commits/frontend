import { getAuditObject } from "~/utils/getAuditObject.js";
import { apps } from "@webiny/common-audit-logs";

export const AUDIT = getAuditObject(apps);
