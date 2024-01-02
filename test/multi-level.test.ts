import { createPinia } from 'pinia'
import { describe, expect, test } from 'vitest'
import { type PiniaStore, defineGenericStore, useStore } from '../src'

interface BaseItem {
  id: number
}

type BaseStore1<T extends BaseItem> = PiniaStore<
  'base1',
  {
    value1: T | null
    undefinedValue1: string
  }
>

type BaseStore2<T extends BaseItem> = PiniaStore<
  'base2',
  {
    value2: T | null
    undefinedValue2: string
  },
  {},
  {},
  BaseStore1<T>
>

type BaseStore3<T extends BaseItem> = PiniaStore<
  'base3',
  {
    value3: T | null
    undefinedValue3: string
  },
  {},
  {},
  BaseStore2<T>
>

type MyStore = PiniaStore<
  'mystore',
  {},
  {
    getValue1(): BaseItem | null
    getValue2(): BaseItem | null
    getValue3(): BaseItem | null
  },
  {
    setValue1(value: BaseItem): void
    setValue2(value: BaseItem): void
    setValue3(value: BaseItem): void
  },
  BaseStore3<BaseItem>
>

function baseStore1<T extends BaseItem>() {
  return defineGenericStore<BaseStore1<T>>({
    state: {
      value1: null,
      undefinedValue1: 'I am undefined',
    },
  })
}

function baseStore2<T extends BaseItem>() {
  return defineGenericStore<BaseStore2<T>, BaseStore1<T>>({
    state: {
      value2: null,
      undefinedValue1: undefined,
      undefinedValue2: 'I am undefined',
    },
  },
  baseStore1<T>(),
  )
}

function baseStore3<T extends BaseItem>() {
  return defineGenericStore<BaseStore3<T>, BaseStore2<T>>({
    state: {
      value3: null,
      undefinedValue1: 'I am not undefined!',
      undefinedValue2: undefined,
      undefinedValue3: 'I am undefined',
    },
  },
  baseStore2<T>(),
  )
}

const useMyStore = useStore<MyStore, BaseStore3<BaseItem>>(
  'mystore',
  {
    state: {
      value1: { id: 1 },
      value2: { id: 2 },
      value3: { id: 3 },
      undefinedValue3: undefined,
    },
    getters: {
      getValue1() {
        return this.value1
      },
      getValue2() {
        return this.value2
      },
      getValue3() {
        return this.value3
      },
    },
    actions: {
      setValue1(value) {
        this.value1 = value
      },
      setValue2(value) {
        this.value2 = value
      },
      setValue3(value) {
        this.value3 = value
      },
    },
  },
  baseStore3<BaseItem>(),
)

describe('Multi-level generic example', () => {
  test('useStore should return a store definition with the given id and properties', () => {
    const pinia = createPinia()
    const store = useMyStore(pinia)

    expect(store).toHaveProperty('$id', 'mystore')

    store.setValue1({ id: 4 })
    expect(store.getValue1).toMatchObject({ id: 4 })

    store.$reset()
    expect(store.getValue1).toMatchObject({ id: 1 })
  })

  test('state should be initialized with the given values', () => {
    const pinia = createPinia()
    const store = useMyStore(pinia)

    expect(store.value1).toMatchObject({ id: 1 })
    expect(store.value2).toMatchObject({ id: 2 })
    expect(store.value3).toMatchObject({ id: 3 })
  })

  test('getters should return the same value as the state', () => {
    const pinia = createPinia()
    const store = useMyStore(pinia)

    expect(store.getValue1).toBe(store.value1)
    expect(store.getValue2).toBe(store.value2)
    expect(store.getValue3).toBe(store.value3)
  })

  test('undefined properties should be ignored', () => {
    const pinia = createPinia()
    const store = useMyStore(pinia)

    expect(store.undefinedValue1).toBe('I am not undefined!')
    expect(store.undefinedValue2).toBeUndefined()
    expect(store.undefinedValue3).toBeUndefined()
  })

  test('actions should set the state to the given value', () => {
    const pinia = createPinia()
    const store = useMyStore(pinia)

    store.setValue1({ id: 4 })
    store.setValue2({ id: 5 })
    store.setValue3({ id: 6 })

    expect(store).toMatchObject({
      value1: { id: 4 },
      value2: { id: 5 },
      value3: { id: 6 },
    })
  })
})
