import { BaseStore } from 'lbrx'

export type StoreClass<T extends BaseStore<any, any>> = new (...args: any[]) => T

export class StoresService {
  private static _storesService: StoresService

  private readonly _stores = new Map<StoreClass<any>, InstanceType<StoreClass<any>>>()

  private constructor() { }

  public static getStoresService(): StoresService {
    if (this._storesService) return this._storesService
    this._storesService = new StoresService()
    return this._storesService
  }

  public get<T extends StoreClass<InstanceType<T>>>(store: T, ...args: any): InstanceType<T> {
    if (this._stores.has(store)) return this._stores.get(store)!
    this._stores.set(store, new store(args))
    return this._stores.get(store)!
  }
}

export const STORES = StoresService.getStoresService()
