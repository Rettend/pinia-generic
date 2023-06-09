import { type Store, type StoreDefinition, defineStore } from 'pinia'
import type { ExtractStoreType, PiniaActionThisStore, PiniaGetterThisStore, StoreAllThis, StoreThis } from './types'

export function createState<
  TStore extends Store, TGenericStore extends Store,
>(
  state: Omit<ExtractStoreType<TStore>['state'], keyof ExtractStoreType<TGenericStore>['state']>,
): ExtractStoreType<TStore>['state'] {
  return state
}

export function createGetters<
  TStore extends Store, TGenericStore extends Store,
>(
  getters: PiniaGetterThisStore<TStore, TGenericStore>,
): ExtractStoreType<TStore>['getters'] {
  return getters
}

export function createActions<
  TStore extends Store, TGenericStore extends Store,
>(
  actions: PiniaActionThisStore<TStore, TGenericStore>,
): ExtractStoreType<TStore>['actions'] {
  return actions
}

export function defineGenericStore<
  TStore extends Store,
>(
  store: StoreThis<TStore>,
) {
  return {
    ...store,
  }
}

export function useStore<
  TStore extends Store, TGenericStore extends Store = TStore,
>(
  id: string,
  store: StoreAllThis<TStore, TGenericStore>,
  genericStore: StoreThis<TGenericStore> = {},
) {
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
    ExtractStoreType<TStore>['state'],
    ExtractStoreType<TStore>['getters'],
    ExtractStoreType<TStore>['actions']
  >
}
