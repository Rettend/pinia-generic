import { type Store, createPinia } from 'pinia'
import { describe, expect, test } from 'vitest'
import { type PiniaStore, createActions, createGetters, createState, defineGenericStore, useStore } from '../src'

interface Category {
  id: number
  name: string
}

type CategoryStore = PiniaStore<
  BaseStore<Category>,
  'category',
  {
    some: string
  },
  {
    getLength(): number
  },
  {
    remove(id: number): void
  }
>

const state = createState<CategoryStore, BaseStore<Category>>({
  some: 'some text',
})

const getters = createGetters<CategoryStore, BaseStore<Category>>({
  getLength() {
    return this.all.length
  },
})

const actions = createActions<CategoryStore, BaseStore<Category>>({
  remove(id: number) {
    this.all = this.all.filter(item => item.id !== id)
  },
})

type BaseStore<T> = Store<
  'base',
  {
    current: Category | null
    all: T[]
  },
  {
    getName(): string | undefined
  },
  {
    add(item: T): void
  }
>

function baseStore<T extends Category>() {
  return defineGenericStore<BaseStore<T>>({
    state: {
      current: { id: 1, name: 'test current' },
      all: [],
    },
    getters: {
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
  {
    state,
    getters,
    actions,
  },
  baseStore<Category>(),
)

describe('Full generic example', () => {
  test('createState should return an object with the given properties', () => {
    expect(state).toMatchObject({ some: 'some text' })
  })

  test('createGetters should return an object with the given functions', () => {
    expect(getters).toHaveProperty('getLength')
  })

  test('createActions should return an object with the given functions', () => {
    expect(actions).toHaveProperty('remove')
  })

  test('defineGenericStore should return an object with state, getters and actions properties', () => {
    const store = baseStore<Category>()

    expect(store).toHaveProperty('state')
    expect(store).toHaveProperty('getters')
    expect(store).toHaveProperty('actions')
  })

  test('useStore should return a store definition with the given id and properties', () => {
    const pinia = createPinia()
    const store = useCategoryStore(pinia)

    expect(store).toHaveProperty('$id', 'category')

    store.add({ id: 1, name: 'test all' })
    expect(store.getLength).toBe(1)
    expect(store.getName).toBe('test current')
    store.remove(1)
    expect(store).toMatchObject({ all: [] })
  })
})
