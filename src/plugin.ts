import type { PiniaPluginContext, Store } from 'pinia'
import { defineStore } from 'pinia'
import type { ExtractStoreType, PiniaActionTree, PiniaGetterTree, PiniaStateTree } from './types'

export function PiniaGeneric(context: PiniaPluginContext) {

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

// export function createState<TStore extends BaseStore>(
//   state: (this: TStore) => Partial<ExtractStoreType<TStore>>['state'],
// ): Partial<ExtractStoreType<TStore>>['state'] {
//   return { ...state }
// }

// export function createActions<TStore extends BaseStore>(
//   actions: (this: TStore) => Partial<ExtractStoreType<TStore>>['actions'],
// ): Partial<ExtractStoreType<TStore>>['actions'] {
//   return { ...actions }
// }

// export function createActions<TStore extends AddThis<BaseStore>>(
//   actions: (this: TStore) => AddThis<ExtractStoreType<TStore>['actions']>,
// ): ExtractStoreType<TStore>['actions'] {
//   return { ...actions }
// }

// helper store type that adds "this" to your store
// type AddThis<TStore extends BaseStore> = {
//   [K in keyof TStore]: TStore[K] extends (...args: infer P) => infer R
//     ? (this: TStore, ...args: P) => R
//     : TStore[K]
// }

// type GenericStore<
//   TName extends string,
//   TState extends Record<string, any>,
//   TGetters extends Record<string, (this: GenericStore<TName, TState, TGetters, TActions>) => any>,
//   TActions extends Record<string, (this: GenericStore<TName, TState, TGetters, TActions>, ...args: any[]) => any>,
// > = AddThis<Store<TName, TState, TGetters, TActions>>

// type GenericStore<
//   TName extends string,
//   TState extends Record<string, any>,
//   TGetters extends Record<string, (this: AddThis<GenericStore<TName, TState, TGetters, TActions>>) => any>,
//   TActions extends Record<string, (this: AddThis<GenericStore<TName, TState, TGetters, TActions>>, ...args: any[]) => any>,
// > = AddThis<Store<TName, TState, TGetters, TActions>>

// type AddThis<TStore> = {
//   [K in keyof TStore]: TStore[K] extends (...args: infer P) => infer R
//     ? (this: TStore, ...args: P) => R
//     : TStore[K]
// }

// export function createState<TStore extends AddThis<BaseStore>>(
//   state: (this: TStore) => AddThis<ExtractStoreType<TStore>['state']>,
// ): ExtractStoreType<TStore>['state'] {
//   return { ...state }
// }

// export function createGetters<TStore extends AddThis<BaseStore>>(
//   getters: (this: TStore) => AddThis<ExtractStoreType<TStore>['getters']>,
// ): ExtractStoreType<TStore>['getters'] {
//   return { ...getters }
// }

// export function createActions<TStore extends AddThis<BaseStore>, TThis = TStore>(
//   actions: (this: TThis) => AddThis<ExtractStoreType<TStore>['actions']>,
// ): ExtractStoreType<TStore>['actions'] {
//   return { ...actions }
// }

// function addThis<TStore extends BaseStore>(store: TStore): TStore {
//   const newStore = { ...store }
//   for (const key in store) {
//     if (typeof store[key] === 'function') {
//       newStore[key] = function (this: TStore, ...args: any[]) {
//         return store[key].apply(this, args)
//       } as TStore[typeof key]
//     }
//   }
//   return newStore
// }

// type StoreKeys = keyof Store<string, PiniaStateTree, PiniaGetterTree, PiniaActionTree>

// type AddThis<TStore> = {
//   [K in keyof TStore]: K extends StoreKeys
//     ? TStore[K]
//     : TStore[K] extends (...args: infer P) => infer R
//       ? (this: TStore, ...args: P) => R
//       : TStore[K]
// }

// export function createState<TStore extends BaseStore>(
//   state: Record<string, any>,
// ): BaseStore['state'] {
//   return { ...state }
// }

// export function createGetters<TStore extends BaseStore>(
//   getters: Record<string, (this: TStore) => any>,
// ): BaseStore['getters'] {
//   return { ...getters }
// }

// export function createActions<TStore extends BaseStore>(
//   actions: Record<string, (this: TStore, ...args: any[]) => any>,
// ): BaseStore['actions'] {
//   return { ...actions }
// }

interface Category {
  id: number
  name: string
}

// type GenericStore<
//   TName extends string,
//   TState extends Record<string, any>,
//   TGetters extends Record<string, (this: GenericStore<TName, TState, TGetters, TActions>) => any>,
//   TActions extends Record<string, (this: GenericStore<TName, TState, TGetters, TActions>, ...args: any[]) => any>,
// > = Store<TName, TState, TGetters, TActions>

type CategoryStore = Store<
  'category',
  {
    current: Category | null
    all: Category[]
  },
  {
    getLength(): number
    getName(): string | null
  },
  {
    addEmpty(item: Category): void
  }
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

const state = createState<CategoryStore>({
  current: null,
  all: [],
})

const getters = createGetters<CategoryStore>({
  getLength() {
    return this.all.length
  },
  getName() {
    return this.current?.name
  },
})

const actions = createActions<CategoryStore>({
  addEmpty(item: Category) {
    this.all.push(item)
  },
})

export const categoryStore = defineStore('category', {
  state: () => state,
  getters,
  actions,
})

const store = categoryStore()

store.addEmpty({ id: 1, name: 'test' })
