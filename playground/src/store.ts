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

// function baseStore<T extends Category | Todo>() {
//   return defineGenericStore<BaseStore<T>>({
//     state: {
//       current: null,
//       all: [],
//     },
//     getters: {
//       getLength() {
//         return this.all.length
//       },
//       getName() {
//         return this.current?.name
//       },
//       isDone() {
//         if (this.current && 'done' in this.current)
//           return this.current?.done
//       },
//     },
//     actions: {
//       add(item: T) {
//         this.all.push(item)
//       },
//     },
//   })
// }

// splitting the generic store too

function baseState<T extends Category>() {
  return createState<BaseStore<T>>({
    current: null,
    all: [],
  })
}

function baseGetters<T extends Category>() {
  return createGetters<BaseStore<T>>({
    getLength() {
      return this.all.length
    },
    getName() {
      return this.current?.name
    },
  })
}

function baseActions<T>() {
  return createActions<BaseStore<T>>({
    add(item: T) {
      this.all.push(item)
    },
  })
}

function baseStore<T extends Category>() {
  return defineGenericStore<BaseStore<T>>({
    state: baseState<T>(),
    getters: baseGetters<T>(),
    actions: baseActions<T>(),
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

// TODO: support options (persistedstate, etc.)

interface Book {
  id: number
  name: string
  price: number
}

type ProductStore<T> = PiniaStore<
  'product',
  {
    all: T[]
  },
  {
    getTotal(): number
    getMaxPrice(): number
  },
  {
    add(item: T): void
  }
>

function productStore<T extends Book>() {
  return defineGenericStore<ProductStore<T>>({
    state: {
      all: [],
    },
    getters: {
      getTotal() {
        return this.all.reduce((total, item) => total + item.price, 0)
      },
      getMaxPrice() {
        return this.all.reduce((max, item) => Math.max(max, item.price), 0)
      },
    },
    actions: {
      add(item: T) {
        this.all.push(item)
      },
    },
  })
}

type BookStore = PiniaStore<
  'book',
  {
    active: Book | null
  },
  {
    getAveragePrice(): number
  },
  {},
  ProductStore<Book>
>

const bookState = createState<BookStore, ProductStore<Book>>({
  active: null,
  all: [
    { id: 1, name: 'The Lord of the Rings', price: 20 },
    { id: 2, name: 'The Hitchhiker\'s Guide to the Galaxy', price: 42 },
    { id: 3, name: 'The Little Prince', price: 10 },
  ],
})

const bookGetters = createGetters<BookStore, ProductStore<Book>>({
  getAveragePrice() {
    return this.getTotal / this.all.length
  },
})

export const useBookStore = useStore<BookStore, ProductStore<Book>>(
  'book',
  {
    state: bookState,
    getters: bookGetters,
  },
  productStore<Book>(),
)
