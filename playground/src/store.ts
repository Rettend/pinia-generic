import { type Store } from 'pinia'
import { type PiniaStore, createActions, createGetters, createState, defineGenericStore, useStore } from 'generic-plugin'

interface Category {
  id: number
  name: string
}

// export const useCategoryStore = defineStore({
//   id: 'category',
//   state: () => ({
//     all: [] as Category[],
//     current: undefined as Category | undefined,
//   }),
//   actions: {
//     addEmpty(item: Category) {
//       this.all.push(item)
//     },
//   },
// })

// type CategoryStore = Store<
//   'category',
//   {
//     current: Category | null
//     all: Category[]
//   },
//   {
//     getLength(): number
//     getName(): string | null
//     getMaxId(): number
//   },
//   {
//     add(item: Category): void
//     remove(id: number): void
//   }
// >

// const state = createState<CategoryStore>({
//   current: null,
//   all: [],
// })

// const getters = createGetters<CategoryStore>({
//   getLength() {
//     return this.all.length
//   },
//   getName() {
//     return this.current?.name
//   },
//   getMaxId() {
//     return this.all.reduce((max, item) => Math.max(max, item.id), 0)
//   },
// })

// const actions = createActions<CategoryStore>({
//   add(item: Category) {
//     this.all.push(item)
//   },
//   remove(id: number) {
//     this.all = this.all.filter(item => item.id !== id)
//   },
// })

// export const useCategoryStore = defineStore('category', {
//   state: () => state,
//   getters,
//   actions,
// })

// type CategoryStore = Store<
//   'category',
//   {},
//   {
//     getMaxId(): number
//   },
//   {
//     remove(id: number): void
//   }
// >

type CategoryStore = PiniaStore<
  BaseStore<Category>,
  'category',
  {
    some: string
  },
  {
    getMaxId(): number
  },
  {
    remove(id: number): void
  }
>

const state = createState<BaseStore<Category>, CategoryStore>({
  some: '12',
})

const getters = createGetters<BaseStore<Category>, CategoryStore>({
  getMaxId() {
    return this.all.reduce((max, item) => Math.max(max, item.id), 0)
  },
})

const actions = createActions<BaseStore<Category>, CategoryStore>({
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
    getName(): string | undefined
  },
  {
    add(item: T): void
  }
>

function baseStore<T extends Category>() {
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
  })
}

export const useCategoryStore = useStore<BaseStore<Category>, CategoryStore>(
  'category',
  baseStore<Category>(),
  {
    state,
    getters,
    actions,
  },
)
