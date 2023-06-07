import { type PiniaPluginContext, type Store, type StoreDefinition, defineStore } from 'pinia'
import type { ExtractStoreType, PiniaActionThis, PiniaGetterThis, PiniaStateTree } from './types'

export function piniaGeneric(context: PiniaPluginContext) {

}

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
  store: Required<GenericStore<TStore>>,
) {
  return {
    ...store,
  }
}

interface GenericStore<TStore extends Store> {
  state?: () => PiniaStateTree
  getters?: PiniaGetterThis<TStore>
  actions?: PiniaActionThis<TStore>
}

export function useStore<
  TStore extends Store,
  TGenericStore extends Store,
>(
  id: string,
  genericStore: GenericStore<TGenericStore>,
  store: GenericStore<TStore>,
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

// testing ground:

interface Category {
  id: number
  name: string
}

type CategoryStore = Store<
  'category',
  {
    current: Category | null
    all: Category[]
  },
  {
    getLength(): number
    getName(): string | null
    getMaxId(): number
  },
  {
    add(item: Category): void
    remove(id: number): void
  }
>

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
  getMaxId() {
    return this.all.reduce((max, item) => Math.max(max, item.id), 0)
  },
})

const actions = createActions<CategoryStore>({
  add(item: Category) {
    this.all.push(item)
  },
  remove(id: number) {
    this.all = this.all.filter(item => item.id !== id)
  },
})

type BaseStore<T> = Store<
  'base',
  {
    current: T | null
    all: T[]
  },
  {
    getLength(): number
    getName(): string | null
  },
  {
    add(item: T): void
  }
>

function baseStore <T extends Category>() {
  return defineGenericStore<BaseStore<T>>({
    state: () => ({
      current: null,
      all: [],
    }),
    getters: {
      getLength() {
        return this.all.length
      },
      getName() {
        return this.current?.name
      },
    },
    actions: {
      add(item: T) {
        this.all.push(item)
      },
    },
  })
}

export const useCategoryStore = useStore<CategoryStore, BaseStore<Category>>(
  'category',
  baseStore<Category>(),
  {
    state: () => state,
    getters,
    actions,
  },
)

export const useCategoryStore2 = useStore('category', baseStore<Category>(), {
  state: () => state,
  getters,
  actions,
})

const category = useCategoryStore()

const length = category.all
