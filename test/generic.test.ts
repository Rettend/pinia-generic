import type { Store } from 'pinia'
import type { PiniaStore } from '../src'
import { createPinia } from 'pinia'
import { describe, expect, expectTypeOf, it } from 'vitest'
import { createActions, createGetters, createState, defineGenericStore, useStore } from '../src'

interface Category {
  id: number
  name: string
}

type CategoryStore = PiniaStore<
  'category',
  {
    some: string
  },
  {
    getLength: () => number
  },
  {
    remove: (id: number) => void
  },
  BaseStore<Category>
>

const state = createState<CategoryStore, BaseStore<Category>>({
  current: { id: 1, name: 'test current' },
  all: [
    { id: 0, name: 'Laptop' },
  ],
  some: 'some text',
  undefinedState: undefined,
})

const getters = createGetters<CategoryStore, BaseStore<Category>>({
  getLength() {
    return this.all.length
  },
  undefinedGetter: undefined,
})

const actions = createActions<CategoryStore, BaseStore<Category>>({
  remove(id: number) {
    this.all = this.all.filter(item => item.id !== id)
  },
  undefinedAction: undefined,
})

type BaseStore<T> = Store<
  'base',
  {
    current: T | undefined
    all: T[]
    undefinedState: string
  },
  {
    getName: () => string | undefined
    undefinedGetter: () => T | undefined
  },
  {
    add: (item: T) => void
    undefinedAction: () => T | undefined
  }
>

function baseStore<T extends Category>() {
  return defineGenericStore<BaseStore<T>>({
    state: {
      undefinedState: 'I am undefined',
    },
    getters: {
      getName() {
        return this.current?.name
      },
      undefinedGetter() {
        return this.current
      },
    },
    actions: {
      add(item: T) {
        this.all.push(item)
      },
      undefinedAction() {
        return this.current
      },
    },
  })
}

export const useCategoryStore = useStore<CategoryStore, BaseStore<Category>>(
  'category',
  {
    state,
    getters,
    actions,
  },
  baseStore<Category>(),
)

describe('full generic example', () => {
  it('should have correct types', () => {
    const pinia = createPinia()
    const store = useCategoryStore(pinia)
    // state
    expectTypeOf(store.current).toEqualTypeOf<Category | undefined>()
    expectTypeOf(store.all).toEqualTypeOf<Category[]>()
    expectTypeOf(store.some).toBeString()
    // getters
    expectTypeOf(store.getName).toEqualTypeOf<string | undefined>()
    expectTypeOf(store.getLength).toBeNumber()
    // actions
    expectTypeOf(store.add).toEqualTypeOf<(item: Category) => void>()
    expectTypeOf(store.remove).toEqualTypeOf<(id: number) => void>()
  })

  it('createState should return an object with the given properties', () => {
    const pinia = createPinia()
    const store = useCategoryStore(pinia)

    expect(store.some).toBe('some text')
  })

  it('createGetters should return an object with the given functions', () => {
    const pinia = createPinia()
    const store = useCategoryStore(pinia)

    store.add({ id: 1, name: 'Mobile' })
    expect(store.getLength).toBe(2)
  })

  it('createActions should return an object with the given functions', () => {
    expect(actions).toHaveProperty('remove')
  })

  it('defineGenericStore should return an object with state, getters and actions properties', () => {
    const store = baseStore<Category>()

    expect(store).toHaveProperty('state')
    expect(store).toHaveProperty('getters')
    expect(store).toHaveProperty('actions')
  })

  it('undefined properties should be ignored', () => {
    const pinia = createPinia()
    const store = useCategoryStore(pinia)

    expect(store.undefinedState).toBeUndefined()
    expect(store.undefinedGetter).toBeUndefined()
    expect(store.undefinedAction).toBeUndefined()
  })

  it('useStore should return a store definition with the given id and properties', () => {
    const pinia = createPinia()
    const store = useCategoryStore(pinia)
    store.all = []

    expect(store).toHaveProperty('$id', 'category')

    store.add({ id: 1, name: 'Computer' })

    expect(store.getLength).toBe(1)
    expect(store.getName).toBe('test current')

    store.remove(1)

    expect(store).toMatchObject({ all: [] })
  })
})
