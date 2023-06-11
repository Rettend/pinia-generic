import { type Store, type StoreDefinition, defineStore } from 'pinia'
import type { ExtractStore, PiniaActionThis, PiniaGetterThis, StoreThis } from './types'

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
  state: Omit<ExtractStore<TStore>['state'], keyof ExtractStore<TGenericStore>['state']> & Partial<ExtractStore<TGenericStore>['state']>,
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
 */
export function defineGenericStore<
  TStore extends Store,
>(
  store: StoreThis<TStore>,
) {
  return {
    ...store,
  }
}
// #endregion defineGenericStore

function filterUndefined<T extends Record<string, any>>(obj: T, undefinedProps: Set<string>): T {
  const result = Object.keys (obj).reduce ((result, key) => {
    const value = obj[key]
    if (value !== undefined) {
      if (typeof value === 'object' && value !== obj && value !== null) {
        for (const subKey of Object.keys(value)) {
          if (value[subKey] === undefined)
            undefinedProps.add (subKey)
          else
            result[key as keyof T] = value
        }
      }
    }
    return result
  }, {} as T)

  for (const prop of undefinedProps) {
    for (const key of Object.keys(result)) {
      for (const subKey of Object.keys(result[key])) {
        if (subKey === prop)
          delete result[key][subKey]
      }
    }
  }

  return result
}

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
  }) as StoreDefinition<
    TStore['$id'],
    ExtractStore<TStore>['state'],
    ExtractStore<TStore>['getters'],
    ExtractStore<TStore>['actions']
  >
}
// #endregion useStore
