import { UnsetPatFromLocalStorage } from "./UnsetPatFromLocalStorage.js";
import { LocalStorageService } from "~/abstractions/index.js";

export interface ILogoutUserDi {
    localStorageService: LocalStorageService.Interface;
}

export class LogoutUser {
    di: ILogoutUserDi;

    constructor(di: ILogoutUserDi) {
        this.di = di;
    }

    execute() {
        const unsetPatFromLocalStorage = new UnsetPatFromLocalStorage(this.di);
        return unsetPatFromLocalStorage.execute();
    }
}
