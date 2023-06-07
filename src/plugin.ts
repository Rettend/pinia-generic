import { type Store, type StoreDefinition, defineStore } from 'pinia'
import type { ExtractStoreType, PiniaActionThis, PiniaGetterThis, PiniaStateTree, StoreThis } from './types'

export function createState<TStore extends Store = Store>(
  state: PiniaStateTree,
): ExtractStoreType<TStore>['state'] {
  return state
}

export function createGetters<TStore extends Store = Store>(
  getters: PiniaGetterThis<TStore>,
): ExtractStoreType<TStore>['getters'] {
  return getters
}

export function createActions<TStore extends Store = Store>(
  actions: PiniaActionThis<TStore>,
): ExtractStoreType<TStore>['actions'] {
  return actions
}

export function defineGenericStore<
  TStore extends Store,
>(
  store: Required<StoreThis<TStore>>,
) {
  return {
    ...store,
  }
}

export function useStore<
  TStore extends Store,
  TGenericStore extends Store,
>(
  id: string,
  genericStore: StoreThis<TGenericStore>,
  store: StoreThis<TStore>,
) {
  return defineStore({
    id,
    state: () => ({
      ...store.state,
      ...genericStore.state,
    }),
    getters: {
      ...store.getters,
      ...genericStore.getters,
    },
    actions: {
      ...store.actions,
      ...genericStore.actions,
    },
  }) as StoreDefinition<
    TStore['$id'],
    ExtractStoreType<TStore>['state'],
    ExtractStoreType<TStore>['getters'],
    ExtractStoreType<TStore>['actions']
  >
}
