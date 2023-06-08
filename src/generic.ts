import { type Store, type StoreDefinition, defineStore } from 'pinia'
import type { ExtractStoreType, PiniaActionThisStore, PiniaGetterThisStore, StoreAll, StoreAllThis } from './types'

export function createState<
  TGenericStore extends Store,
  TStore extends Store,
>(
  state: Omit<ExtractStoreType<TStore>['state'], keyof ExtractStoreType<TGenericStore>['state']>,
): ExtractStoreType<TStore>['state'] {
  return state
}

export function createGetters<
  TGenericStore extends Store,
  TStore extends Store = Store,
>(
  getters: PiniaGetterThisStore<TStore, TGenericStore>,
): ExtractStoreType<TStore>['getters'] {
  return getters
}

export function createActions<
  TGenericStore extends Store,
  TStore extends Store = Store,
>(
  actions: PiniaActionThisStore<TStore, TGenericStore>,
): ExtractStoreType<TStore>['actions'] {
  return actions
}

export function defineGenericStore<
  TStore extends Store,
>(
  store: StoreAll<TStore>,
) {
  return {
    ...store,
  }
}

export function useStore<
  TGenericStore extends Store,
  TStore extends Store,
>(
  id: string,
  genericStore: StoreAll<TGenericStore>,
  store: StoreAllThis<TStore, TGenericStore>,
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
