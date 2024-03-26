import type { DefineStoreOptionsBase, StateTree, Store } from 'pinia'

// #region PiniaGetterThis
/**
 * Getters with `this` context of the store and the generic store combined.
 * Puts all of the properties into `this`, while it only requires the getters unique to the store to be defined.
 * @internal
 */
export type PiniaGetterThis<TStore extends Store, TGenericStore extends Store = TStore> = {
  [K in keyof (Omit<ExtractStore<TStore>['getters'], keyof ExtractStore<TGenericStore>['getters']> & Partial<ExtractStore<TGenericStore>['getters']>)]?:
  ((this: TStore & NoId<TGenericStore>) => ExtractStore<TStore>['getters'][K] extends (...args: any[]) => any ? ReturnType<ExtractStore<TStore>['getters'][K]> : never) | undefined
}
// #endregion PiniaGetterThis

// #region PiniaActionThis
/**
 * Actions with `this` context of the store and the generic store combined.
 * Puts all of the properties into `this`, while it only requires the actions unique to the store to be defined.
 * @internal
 */
export type PiniaActionThis<TStore extends Store, TGenericStore extends Store = TStore> = {
  [K in keyof (Omit<ExtractStore<TStore>['actions'], keyof ExtractStore<TGenericStore>['actions']> & Partial<ExtractStore<TGenericStore>['actions']>)]?:
  ((this: TStore & NoId<TGenericStore>, ...args: ExtractStore<TStore>['actions'][K] extends (...args: any[]) => any ? Parameters<ExtractStore<TStore>['actions'][K]> : never)
  => ExtractStore<TStore>['actions'][K] extends (...args: any[]) => any ? ReturnType<ExtractStore<TStore>['actions'][K]> : never) | undefined
}
// #endregion PiniaActionThis

// #region StoreThis
/**
 * Store with `this` context of the store and the generic store combined.
 * Puts all of the properties into `this`, while it only requires the ones unique to the store to be defined.
 * @internal
 */
export interface StoreThis<TStore extends Store, TGenericStore extends Store = Store> {
  state?: {
    [K in keyof (Omit<ExtractStore<TStore>['state'], keyof ExtractStore<TGenericStore>['state']> & Partial<ExtractStore<TGenericStore>['state']>)]?:
    (Omit<ExtractStore<TStore>['state'], keyof ExtractStore<TGenericStore>['state']> & Partial<ExtractStore<TGenericStore>['state']>)[K] | undefined;
  }
  getters?: PiniaGetterThis<TStore, TGenericStore>
  actions?: PiniaActionThis<TStore, TGenericStore>
  // options?: Omit<DefineStoreOptions<TStore['$id'], TStore['$state'], ExtractStore<TStore>['getters'], ExtractStore<TStore>['actions']>, 'id'>
  options?: DefineStoreOptionsBase<ExtractStore<TStore>['state'], TStore>
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
export type ExtractStore<TStore extends Store> = TStore extends Store<
  string,
  infer S extends StateTree,
  infer G,
  infer A
>
  ? {
      state: S
      getters: G
      actions: A
    }
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
  Id extends string = string,
  State extends StateTree = object,
  Getters = object,
  Actions = object,
  TGenericStore extends Store = Store,
> = Store<
  Id,
  State & ExtractStore<TGenericStore>['state'],
  Getters & ExtractStore<TGenericStore>['getters'],
  Actions & ExtractStore<TGenericStore>['actions']
>
// #endregion PiniaStore

export type NoId<TStore extends Partial<Store>> = Omit<TStore, '$id'>
