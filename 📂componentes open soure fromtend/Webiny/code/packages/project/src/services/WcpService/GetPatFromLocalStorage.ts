import { LocalStorageService } from "~/abstractions/index.js";

export interface IGetPatFromLocalStorageDi {
    localStorageService: LocalStorageService.Interface;
}

export class GetPatFromLocalStorage {
    di: IGetPatFromLocalStorageDi;

    constructor(di: IGetPatFromLocalStorageDi) {
        this.di = di;
    }

    execute() {
        const { localStorageService } = this.di;

        return localStorageService.get("wcpPat") as string | null;
    }
}
