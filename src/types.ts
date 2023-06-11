import type { StateTree, Store } from 'pinia'

type PiniaStateTree = StateTree
type PiniaGettersTree = Record<string | number | symbol, () => any>
type PiniaActionsTree = Record<string | number | symbol, (...args: any[]) => any>

// #region PiniaGetterThis
/**
 * Getters with `this` context of the store and the generic store combined.
 * Puts all of the properties into `this`, while it only requires the getters unique to the store to be defined.
 * @internal
 */
export type PiniaGetterThis<TStore extends Store, TGenericStore extends Store = TStore> = {
  [K in keyof Omit<ExtractStore<TStore>['getters'], keyof ExtractStore<TGenericStore>['getters']>]:
  (this: TStore) => ReturnType<ExtractStore<TStore>['getters'][K]>
}
// #endregion PiniaGetterThis

// #region PiniaActionThis
/**
 * Actions with `this` context of the store and the generic store combined.
 * Puts all of the properties into `this`, while it only requires the actions unique to the store to be defined.
 * @internal
 */
export type PiniaActionThis<TStore extends Store, TGenericStore extends Store = TStore> = {
  [K in keyof Omit<ExtractStore<TStore>['actions'], keyof ExtractStore<TGenericStore>['actions']>]:
  (this: TStore, ...args: Parameters<ExtractStore<TStore>['actions'][K]>)
  => ReturnType<ExtractStore<TStore>['actions'][K]>
}
// #endregion PiniaActionThis

// #region StoreThis
/**
 * Store with `this` context of the store and the generic store combined.
 * Puts all of the properties into `this`, while it only requires the ones unique to the store to be defined.
 * @internal
 */
export interface StoreThis<TStore extends Store, TGenericStore extends Store = Store> {
  state?: Omit<ExtractStore<TStore>['state'], keyof ExtractStore<TGenericStore>['state']>
  getters?: PiniaGetterThis<TStore, TGenericStore>
  actions?: PiniaActionThis<TStore, TGenericStore>
}
// #endregion StoreThis

// #region ExtractStore
/**
 * Extracts the state, getters and actions from a store.
 * @template TStore - The store type.
 * @example
 * Index this type to access the state, getters and actions of a store.
 * ```ts
 * type State = ExtractStore<Store>['state']
 * ```
 * @internal
 */
export type ExtractStore<TStore extends Store> = TStore extends Store<string, infer S, infer G, infer A>
  ? { state: S; getters: G; actions: A }
  : never
// #endregion ExtractStore

// #region PiniaStore
/**
 * Define a type for a store or a generic store. Combines their properties.
 * @template Id - The store ID.
 * @template State - The store state.
 * @template Getters - The store getters.
 * @template Actions - The store actions.
 * @template TGenericStore - The generic store type.
 * @public
 */
export type PiniaStore<
  Id extends string = string, State extends PiniaStateTree = {}, Getters extends PiniaGettersTree = {}, Actions extends PiniaActionsTree = {}, TGenericStore extends Store = Store,
> = Store<
  Id,
  State & ExtractStore<TGenericStore>['state'],
  Getters & ExtractStore<TGenericStore>['getters'],
  Actions & ExtractStore<TGenericStore>['actions']
>
// #endregion PiniaStore
