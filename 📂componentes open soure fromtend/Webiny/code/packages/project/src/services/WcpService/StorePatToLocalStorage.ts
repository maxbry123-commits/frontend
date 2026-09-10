import { LocalStorageService } from "~/abstractions/index.js";

export interface IStorePatToLocalStorageDi {
    localStorageService: LocalStorageService.Interface;
}

export class StorePatToLocalStorage {
    di: IStorePatToLocalStorageDi;

    constructor(di: IStorePatToLocalStorageDi) {
        this.di = di;
    }

    execute(pat: string) {
        const { localStorageService } = this.di;

        localStorageService.set("wcpPat", pat);
    }
}
