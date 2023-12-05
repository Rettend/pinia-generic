import { type PiniaStore, createActions, createGetters, createState, defineGenericStore, useStore } from 'pinia-generic'

interface Category {
  id: number
  name: string
}

type CategoryStore = PiniaStore<
  'category',
  {
    description: string
  },
  {
    getMaxId(): number
  },
  {
    remove(id: number): void
  },
  BaseStore<Category>
>

const state = createState<CategoryStore, BaseStore<Category>>({
  description: 'This is a category store',
  all: [
    { id: 1, name: 'Laptops' },
  ],
})

const getters = createGetters<CategoryStore, BaseStore<Category>>({
  getMaxId() {
    return this.all.reduce((max, item) => Math.max(max, item.id), 0)
  },
  getLength: undefined,
})

const actions = createActions<CategoryStore, BaseStore<Category>>({
  remove(id: number) {
    this.all = this.all.filter(item => item.id !== id)
  },
})

type BaseStore<T> = PiniaStore<
  'base',
  {
    current: T | null
    all: T[]
  },
  {
    getLength(): number
    getName(): string | undefined
  },
  {
    add(item: T): void
  }
>

function baseStore<T extends Category>(
  persist = false,
) {
  return defineGenericStore<BaseStore<T>>({
    state: {
      current: null,
      all: [],
    },
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
    options: {
      persist,
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
  baseStore<Category>(true),
)

interface Book {
  id: number
  name: string
  price: number
}

type BookStore = PiniaStore<
  'book',
  {
    active: Book | null
  },
  {
    getTotal(): number
    getAveragePrice(): number
  },
  {},
  BaseStore<Book>
>

const bookState = createState<BookStore, BaseStore<Book>>({
  active: null,
  all: [
    { id: 1, name: 'The Lord of the Rings', price: 20 },
    { id: 2, name: 'The Hitchhiker\'s Guide to the Galaxy', price: 42 },
    { id: 3, name: 'The Little Prince', price: 10 },
  ],
})

const bookGetters = createGetters<BookStore, BaseStore<Book>>({
  getTotal() {
    return this.all.reduce((total, item) => total + item.price, 0)
  },
  getAveragePrice() {
    return this.getTotal / this.all.length
  },
})

export const useBookStore = useStore<BookStore, BaseStore<Book>>(
  'book',
  {
    state: bookState,
    getters: bookGetters,
  },
  baseStore<Book>(),
)

type TestStore = PiniaStore<
  'test',
  {
    someState: string
  }
>

export const useTestStore = useStore<TestStore>('test', {
  state: {
    someState: 'hello pinia',
  },
  options: {
    persist: true,
  },
})

// Experimenting with multi-level inheritance
type BaseStore1<T> = PiniaStore<
  'base1',
  {
    current: T | null
  },
  {
    getCurrent(): T | null
  },
  {
    setCurrent(item: T): void
  }
>

type BaseStore2<T> = PiniaStore<
  'base2',
  {
    other: T | null
  },
  {
    getOther(): T | null
  },
  {
    setOther(item: T): void
  },
  BaseStore1<T>
>

function baseStore1<T extends Category>() {
  return defineGenericStore<BaseStore1<T>>({
    state: {
      current: null,
    },
    getters: {
      getCurrent() {
        return this.current
      },
    },
    actions: {
      setCurrent(item: T) {
        this.current = item
      },
    },
  })
}

function baseStore2<T extends Category>() {
  return defineGenericStore<BaseStore1<T>, BaseStore2<T>>({
    state: {
      other: null,
    },
    getters: {
      getOther() {
        return this.other
      },
    },
    actions: {
      setOther(item: T) {

      },
    },
  }, baseStore1<T>())
}
