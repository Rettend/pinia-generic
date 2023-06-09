import type { StateTree, Store } from 'pinia'

export type PiniaStateTree = StateTree
export type PiniaGettersTree = Record<string | number | symbol, () => any>
export type PiniaActionsTree = Record<string | number | symbol, (...args: any[]) => any>

export type PiniaGetterThis<TStore extends Store> = Record<string | number | symbol, (this: TStore) => any>
export type PiniaActionThis<TStore extends Store> = Record<string | number | symbol, (this: TStore, ...args: any[]) => any>

export type PiniaGetterThisStore<TStore extends Store, TGenericStore extends Store = TStore> = {
  [K in keyof Omit<ExtractStoreType<TStore>['getters'], keyof ExtractStoreType<TGenericStore>['getters']>]:
  (this: TStore) => ReturnType<ExtractStoreType<TStore>['getters'][K]>
}
export type PiniaActionThisStore<TStore extends Store, TGenericStore extends Store = TStore> = {
  [K in keyof Omit<ExtractStoreType<TStore>['actions'], keyof ExtractStoreType<TGenericStore>['actions']>]:
  (this: TStore, ...args: Parameters<ExtractStoreType<TStore>['actions'][K]>)
  => ReturnType<ExtractStoreType<TStore>['actions'][K]>
}

export type ExtractStoreType<TStore extends Store> = TStore extends Store<string, infer S, infer G, infer A>
  ? { state: S; getters: G; actions: A }
  : never

export interface StoreThis<TStore extends Store> {
  state?: {
    [K in keyof ExtractStoreType<TStore>['state']]: ExtractStoreType<TStore>['state'][K]
  }
  getters?: {
    [K in keyof ExtractStoreType<TStore>['getters']]: (this: TStore) => ReturnType<ExtractStoreType<TStore>['getters'][K]>
  }
  actions?: {
    [K in keyof ExtractStoreType<TStore>['actions']]: (this: TStore, ...args: Parameters<ExtractStoreType<TStore>['actions'][K]>)
    => ReturnType<ExtractStoreType<TStore>['actions'][K]>
  }
}

export interface StoreAllThis<TStore extends Store, TGenericStore extends Store = TStore> {
  state?: PiniaStateTree
  getters?: PiniaGetterThisStore<TStore, TGenericStore>
  actions?: PiniaActionThisStore<TStore, TGenericStore>
}

export type PiniaStore<
  TGenericStore extends Store, Id extends string, State extends PiniaStateTree = {}, Getters extends PiniaGettersTree = {}, Actions extends PiniaActionsTree = {},
> = Store<
  Id,
  State & ExtractStoreType<TGenericStore>['state'],
  Getters & ExtractStoreType<TGenericStore>['getters'],
  Actions & ExtractStoreType<TGenericStore>['actions']
>
