import chokidar from "chokidar";
import {
    type GetApp,
    type GetProjectConfigService,
    type ValidateProjectConfigService
} from "~/abstractions/index.js";

export interface IWebinyConfigWatcherParams {
    webinyConfigPath: string;
    appName: GetApp.AppName;
    getProjectConfigService: GetProjectConfigService.Interface;
    validateProjectConfigService: ValidateProjectConfigService.Interface;
}

export class WebinyConfigWatcher {
    onSuccessCallback?: () => void;
    onErrorCallback?: (err: Error) => void;

    constructor(private params: IWebinyConfigWatcherParams) {}

    run() {
        const { webinyConfigPath, appName, getProjectConfigService, validateProjectConfigService } =
            this.params;
        const watcher = chokidar.watch(webinyConfigPath);

        watcher.on("change", async () => {
            try {
                const projectConfig = await getProjectConfigService.execute({
                    tags: { appName: appName, runtimeContext: "app-build" }
                });

                await validateProjectConfigService.execute(projectConfig);

                // Rebuild.
                if (this.onSuccessCallback) {
                    this.onSuccessCallback();
                }
            } catch (err) {
                if (this.onErrorCallback) {
                    this.onErrorCallback(err as Error);
                }
            }
        });
    }

    onSuccess(callback: () => void) {
        this.onSuccessCallback = callback;
        return this;
    }

    onError(callback: (err: Error) => void) {
        this.onErrorCallback = callback;
        return this;
    }
}
