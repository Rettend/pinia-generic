import type { PiniaPluginContext, Store } from 'pinia'
import type { ExtractStoreType, PiniaActionTree, PiniaGetterTree, PiniaStateTree } from './types'

export function piniaGeneric(context: PiniaPluginContext) {

}

// defineGenericStore is used to define a generic store
// states, getters and actions are
export function defineGenericStore() {

}

type BaseStore = Store<
  string,
  PiniaStateTree,
  PiniaGetterTree,
  PiniaActionTree
>

export function createState<TStore extends BaseStore>(
  state: Record<string, any>,
): ExtractStoreType<TStore>['state'] {
  return { ...state }
}

export function createGetters<TStore extends BaseStore>(
  getters: Record<string, (this: TStore) => any>,
): ExtractStoreType<TStore>['getters'] {
  return { ...getters }
}

export function createActions<TStore extends BaseStore>(
  actions: Record<string, (this: TStore, ...args: any[]) => any>,
): ExtractStoreType<TStore>['actions'] {
  return { ...actions }
}
