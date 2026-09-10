import { sendEvent } from "@webiny/telemetry/cli.js";

export class Analytics {
    track(stage: string, properties: Record<string, any> = {}) {
        const event = this.getEventName(stage);
        return sendEvent({ event, properties });
    }

    getEventName(stage: string) {
        return `cli-create-webiny-project-${stage}`;
    }
}
