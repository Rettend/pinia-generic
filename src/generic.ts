import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Ref, UnwrapRef } from 'vue'
import type { Store, StoreDefinition } from 'pinia'
import { useFetch } from '@vueuse/core'
import type {
  ExtractStoreType,
  PiniaActionTree, PiniaActions,
  PiniaGetterTree, PiniaGetters,
  PiniaState, PiniaStateTree,
  PiniaStore, StoreId,
} from './types'

// ⚡ Two ways to define the generic state:

// 1️⃣ Whole state is T:
// state: () => ({} as T),

// 2️⃣ You want to add more properties to the state:
// state: () => ({
//   id: 0,
//   data: {} as T,
// }),

// ⚠️ this means that you have to cast data to UnwrapRef<T> in the actions
// ⚠️ and when using lists, instead of ({} as T) you have to use (ref<T[]>([]) as Ref<T[]>) 🤷‍♂️

// 👀 This Generic Store is also extendable!

type BaseStore<T> = Store<'Base', BaseState<T>, BaseGetters, BaseActions<T>>
type ExtendedBaseStore<T, S extends Store> = Store<StoreId<S>, BaseState<T>, BaseGetters, BaseActions<T>>
type ExtendedBaseStoreDefinition<T, S extends Store> = StoreDefinition<StoreId<S>, BaseState<T> & ExtractStoreType<S>['state'], BaseGetters & ExtractStoreType<S>['getters'], BaseActions<T> & ExtractStoreType<S>['actions']>

// Helper functions to create state, getters, actions

export function createState<T, S extends Store = BaseStore<T>>(
  state: PiniaState<S>,
): PiniaState<S> {
  return state
}

export function createGetters<T, S extends Store = BaseStore<T>>(
  getters: PiniaGetters<S>,
): PiniaGetters<S> {
  return getters
}

export function createActions<T, S extends Store = BaseStore<T>>(
  actions: PiniaActions<S>,
): PiniaActions<S> {
  return actions
}

export type StoreFactory<
  Id extends string, T, S = Partial<BaseState<T>>, G = Partial<BaseGetters>, A = Partial<BaseActions<T>>,
> = Store<
  Id,
  S & Partial<ExtractStoreType<BaseStore<T>>['state']>,
  G & Partial<ExtractStoreType<BaseStore<T>>['getters']>,
  A & Partial<ExtractStoreType<BaseStore<T>>['actions']>
>

export type State = PiniaStateTree
export type Getters = PiniaGetterTree
export type Actions = PiniaActionTree

// types for Base State, Getters, Actions

type BaseState<T> = {
  current: T | null
  all: Ref<T[]>
} & PiniaStateTree

type BaseGetters = {
  getLength(): number
  getName(): string | undefined
} & PiniaGetterTree

type BaseActions<T> = {
  addEmpty(item: T): void
  get(id: number): Promise<UnwrapRef<T> | undefined>
  getAll(): Promise<T[] | undefined>
} & PiniaActionTree

// type ExtractGeneric<T> = T extends Store<infer G> ? G : never

// define a store factory that takes a generic type and a name and returns a store
export function useStore<
  T extends { id: number }, S extends Store = BaseStore<T>,
>(
  name: string,
  store: {
    state?: PiniaState<S>
    getters?: PiniaGetters<S>
    actions?: PiniaActions<S>
  },
) {
  const baseState = createState<T>(() => ({
    current: null,
    all: ref<T[]>([]) as Ref<T[]>,
  }))

  const baseGetters = createGetters<T>({
    getLength(state) {
      return state.all.value.length
    },
    getName(state) {
      if (state.current && 'name' in state.current)
        return state.current.name as string
    },
  })

  const baseActions = createActions<T>({
    addEmpty(item: T) {
      this.all.value.push(item)
    },
    async get(id: number) {
      if (this.all.value.find(item => item.id === id))
        return this.all.value.find(item => item.id === id)

      const { data, error } = await useFetch<T>(`${name}/${id}`, {
        method: 'GET',
      }).json()
      if (data.value) {
        this.current = data.value
        return data.value as T | undefined
      }
      if (error.value)
        return error.value
    },
    async getAll() {
      const { data, error } = await useFetch<T[]>(`${name}`, {
        method: 'GET',
      }).json()
      if (data.value) {
        this.all.value = data.value as T[]
        return data.value
      }
      if (error.value)
        return error.value
    },
  })

  const { state, getters, actions } = store

  const extendedStore: PiniaStore<ExtendedBaseStore<T, S>> = {
    state: () => ({
      ...baseState(),
      ...state?.(),
    }),
    getters: {
      ...baseGetters,
      ...getters,
    },
    actions: {
      ...baseActions,
      ...actions,
    },
  }

  const extended = defineStore(name, extendedStore) as ExtendedBaseStoreDefinition<T, S>

  return extended
}
