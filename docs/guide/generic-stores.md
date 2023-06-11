---
outline: deep
---

# Generic Stores

## Simple generic store

Just like with the regular store, we need to define a type for the generic store.

The only difference is that we can add arbitrary generic parameters to the type.

```ts
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
```

### `defineGenericStore()` function

A generic store needs to be a generic function, which returns a `defineGenericStore()` call. We define `T` in our function, and then pass it to the `defineGenericStore()` function.

Also, we might need a type constraint on `T` using `extends`. This is when you want to access properties of `T` (in this case `name`) in the generic store.

```ts
// const baseStore = <T extends Category>() => { // or
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
```

## Extending the generic store

Now we have a type that's used throughout our project (this will go in the place of `T`).

```ts
interface Category {
  id: number
  name: string
}
```

The store that extends the generic store adds some properties that are specific to the store.

```ts{10}
type CategoryStore = PiniaStore<
  'category',
  {
    description: string
  },
  {
    getMaxId(): number
  },
  {},
  BaseStore<Category>
>
```

### `useStore()` function

The `useStore()` function is a wrapper around the `defineStore()` function, with the additional generic store parameter. It returns a store with the combined state, getters and actions.

We can go ahead and use the `create` functions.

```ts
const state = createState<CategoryStore, BaseStore<Category>>({
  description: '',
})

const getters = createGetters<CategoryStore, BaseStore<Category>>({
  getMaxId() {
    return this.all.reduce((max, item) => Math.max(max, item.id), 0)
  },
})
```

And pass them to the `useStore()` function.

```ts{7}
export const useCategoryStore = useStore<CategoryStore, BaseStore<Category>>(
  'category',
  {
    state,
    getters,
  },
  baseStore<Category>(),
)
```

::: tip NOTE
You need to pass your store as the first generic parameter, **and the generic store as the second**, with the `T` type substituted.
:::

We can also just define the store in one go, if you don't want to split it up.

```ts
export const useCategoryStore = useStore<CategoryStore, BaseStore<Category>>(
  'category',
  {
    state: {
      description: '',
    },
    getters: {
      getMaxId() {
        return this.all.reduce((max, item) => Math.max(max, item.id), 0)
      },
    },
  },
  baseStore<Category>(),
)
```

## Using more types

Some things might change when you have more types you want to use.

Let's create a `Todo` type with a `remove` action. And as we don't want Categories to be removed, we don't define that in the generic store.

```ts
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
```

Here the `Todo` type has a `name` property, so the `getName()` getter will work. However, we will need a type guard to access the `done` property.

```ts
function baseStore<T extends Category>() {} // [!code --]
function baseStore<T extends Category | Todo>() { // [!code ++]
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
        return this.current?.name // this.current is of type Category | Todo | null
      },
      isDone() { // [!code ++]
        if (this.current && 'done' in this.current) // [!code ++]
          return this.current.done // this.current is of type Todo // [!code ++]
      }, // [!code ++]
    },
    actions: {
      add(item: T) {
        this.all.push(item)
      },
    },
  })
}
```

That's it!

The generic store can also be split up. See an example here: [Generic Examples](/examples/generic).
