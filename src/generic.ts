import { type Store, type StoreDefinition, defineStore } from 'pinia'
import type { ExtractStore, PiniaActionThis, PiniaGetterThis, StoreThis } from './types'
import { filterUndefined } from './utils'

// #region createState
/**
 * Creates a state object for a store.
 * @template TStore - The store type.
 * @template TGenericStore - The generic store type.
 * @param state - The state object.
 */
export function createState<
  TStore extends Store, TGenericStore extends Store = Store,
>(
  state: {
    [K in keyof (Omit<ExtractStore<TStore>['state'], keyof ExtractStore<TGenericStore>['state']> & Partial<ExtractStore<TGenericStore>['state']>)]:
    (Omit<ExtractStore<TStore>['state'], keyof ExtractStore<TGenericStore>['state']> & Partial<ExtractStore<TGenericStore>['state']>)[K] | undefined;
  },
): ExtractStore<TStore>['state'] {
  return state
}
// #endregion createState

// #region createGetters
/**
 * Creates a getters object for a store.
 * @template TStore - The store type.
 * @template TGenericStore - The generic store type.
 * @param getters - The getters object.
 */
export function createGetters<
  TStore extends Store, TGenericStore extends Store = Store,
>(
  getters: PiniaGetterThis<TStore, TGenericStore>,
): ExtractStore<TStore>['getters'] {
  return getters
}
// #endregion createGetters

// #region createActions
/**
 * Creates an actions object for a store.
 * @template TStore - The store type.
 * @template TGenericStore - The generic store type.
 * @param actions - The actions object.
 */
export function createActions<
  TStore extends Store, TGenericStore extends Store = Store,
>(
  actions: PiniaActionThis<TStore, TGenericStore>,
): ExtractStore<TStore>['actions'] {
  return actions
}
// #endregion createActions

// #region defineGenericStore
/**
 * Defines a generic store.
 * @template TStore - The store type.
 * @param store - The store object.
 * @param baseStore - Another base store to extend.
 */
export function defineGenericStore<
  TStore extends Store, TGenericStore extends Store = Store,
>(
  store: StoreThis<TStore, TGenericStore>,
  baseStore: StoreThis<TGenericStore> = {},
) {
  const undefinedProps = new Set<string>()

  store = filterUndefined(store, undefinedProps)
  baseStore = filterUndefined(baseStore, undefinedProps)

  return {
    ...baseStore,
    ...store,
    // state: {
    //   ...baseStore?.state,
    //   ...store?.state,
    // },
    // getters: {
    //   ...baseStore?.getters,
    //   ...store?.getters,
    // },
    // actions: {
    //   ...baseStore?.actions,
    //   ...store?.actions,
    // },
    // options: {
    //   ...baseStore?.options,
    //   ...store?.options,
    // },
  }
}
// #endregion defineGenericStore

// #region useStore
/**
 * Defines a store. Can extend a generic store.
 * @template TStore - The store type.
 * @template TGenericStore - The generic store type.
 * @param id - The store id.
 * @param store - The store object.
 * @param genericStore - The generic store object.
 */
export function useStore<
  TStore extends Store, TGenericStore extends Store = Store,
>(
  id: TStore['$id'],
  store: StoreThis<TStore, TGenericStore>,
  genericStore: StoreThis<TGenericStore> = {},
) {
  const undefinedProps = new Set<string>()

  store = filterUndefined(store, undefinedProps)
  genericStore = filterUndefined(genericStore, undefinedProps)

  return defineStore(id, {
    state: () => ({
      ...genericStore.state,
      ...store.state,
    }),
    getters: {
      ...genericStore.getters,
      ...store.getters,
    },
    actions: {
      ...genericStore.actions,
      ...store.actions,
    },
    ...genericStore.options,
    ...store.options,
  },
  ) as StoreDefinition<
    TStore['$id'],
    ExtractStore<TStore>['state'],
    ExtractStore<TStore>['getters'],
    ExtractStore<TStore>['actions']
  >
}
// #endregion useStore
