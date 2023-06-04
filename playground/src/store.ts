import { type Store, defineStore } from 'pinia'
import { createActions, createGetters, createState } from '../../src/plugin'

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

export const useCategoryStore = defineStore('category', {
  state: () => state,
  getters,
  actions,
})
