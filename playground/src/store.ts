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
})

const getters = createGetters<CategoryStore, BaseStore<Category>>({
  getMaxId() {
    return this.all.reduce((max, item) => Math.max(max, item.id), 0)
  },
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
    isDone(): boolean | undefined
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

function baseState<T>() {
  return createState<BaseStore<T>>({
    current: null,
    all: [],
  })
}

function baseGetters<T extends Category | Todo>() {
  return createGetters<BaseStore<T>>({
    getLength() {
      return this.all.length
    },
    getName() {
      return this.current?.name
    },
    isDone() {
      if (this.current && 'done' in this.current)
        return this.current?.done
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

function baseStore<T extends Category | Todo>() {
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

interface Todo {
  id: number
  name: string
  done: boolean
}

type TodoStore = PiniaStore<
  'todo',
  {},
  {},
  {
    remove(id: number): void
  },
  BaseStore<Todo>
>

export const useTodoStore = useStore<TodoStore, BaseStore<Todo>>(
  'todo',
  {
    actions: {
      remove(id: number) {
        this.all = this.all.filter(item => item.id !== id)
      },
    },
  },
  baseStore<Todo>(),
)
