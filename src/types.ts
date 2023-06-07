import type { StateTree, Store } from 'pinia'

export type PiniaStateTree = StateTree
export type PiniaGettersTree = Record<string | number | symbol, () => any>
export type PiniaActionsTree = Record<string | number | symbol, (...args: any[]) => any>

export type PiniaGetterThis<TStore extends Store> = Record<string | number | symbol, (this: TStore) => any>
export type PiniaActionThis<TStore extends Store> = Record<string | number | symbol, (this: TStore, ...args: any[]) => any>

export type ExtractStoreType<T extends Store> = T extends Store<string, infer S, infer G, infer A>
  ? { state: S; getters: G; actions: A }
  : never

export interface StoreThis<TStore extends Store> {
  state?: () => PiniaStateTree
  getters?: PiniaGetterThis<TStore>
  actions?: PiniaActionThis<TStore>
}

export type PiniaStore<
  TGenericStore extends Store,
  Id extends string,
  State extends PiniaStateTree,
  Getters extends PiniaGettersTree,
  Actions extends PiniaActionsTree,
> = Store<
  Id,
  State & ExtractStoreType<TGenericStore>['state'],
  Getters & ExtractStoreType<TGenericStore>['getters'],
  Actions & ExtractStoreType<TGenericStore>['actions']
>
