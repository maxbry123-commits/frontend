import { LocalStorageService } from "~/abstractions/index.js";

export interface IUnsetPatFromLocalStorageDi {
    localStorageService: LocalStorageService.Interface;
}

export class UnsetPatFromLocalStorage {
    di: IUnsetPatFromLocalStorageDi;

    constructor(di: IUnsetPatFromLocalStorageDi) {
        this.di = di;
    }

    execute() {
        const { localStorageService } = this.di;

        localStorageService.unset("wcpPat");
    }
}
