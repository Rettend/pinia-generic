---
outline: deep
---

# Generic Stores

In large projects, you might have a lot of stores that are very similar. With generic stores, you only need to define the common parts once, and then reuse them in other stores.

## Simple generic store

Just like when splitting stores, we need to define a type for the generic store.

The only difference is that we can add a generic parameter to our store's type.

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

Also, you might need a type constraint on `T` using `extends`. This is when you want to access a property `T` might have (in this case `name`) in the generic store. This way the generic store will work with any type that has a `name` property.

You can also use `T extends Category`.

```ts
// const baseStore = <T>() => { // or
function baseStore<T extends { name: string }>() {
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
        // without the type constraint, this would throw an error:
        // Property 'name' does not exist on type 'NonNullable<T>'.ts(2339)
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

## Using the generic store

Let's say we have a type that's used throughout our project (this will go in the place of `T`):

```ts
interface Category {
  id: number
  name: string
}
```

We define a store type that uses the generic store, and pass `Category` as the generic parameter.

```ts
type CategoryStore = PiniaStore<'category', {}, {}, {}, BaseStore<Category>>
```

### `useStore()` function

The `useStore()` function is a wrapper around the `defineStore()` function, with the additional generic store parameter. It returns a store with the combined state, getters and actions.

Here we add default values to the state defined in the generic store.

```ts{12}
export const useCategoryStore = useStore<CategoryStore, BaseStore<Category>>(
  'category',
  {
    state: {
      current: { id: 1, name: 'Laptops' },
      all: [
        { id: 1, name: 'Laptops' },
        { id: 2, name: 'Phones' },
      ],
    },
  },
  baseStore<Category>(),
)
```

::: tip NOTE
You need to pass your store as the first generic parameter, **and the generic store as the second**, with the `T` type substituted.
:::

Result:

![used store](/used-store.png)

## Extending the generic store

The store that extends the generic store can add some properties that are specific to the store, but still use the generic store's properties.

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

Let's go ahead and split the state and getters just because we can.

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

```ts
export const useCategoryStore = useStore<CategoryStore, BaseStore<Category>>(
  'category',
  {
    state,
    getters,
  },
  baseStore<Category>(),
)
```

We can also just define the store inline, if there's no need to split it up.

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

Here the `Todo` type has a `name` property, so the `getName()` getter will work. However, we will need a type guard to access the `done` property, so let's move `baseStore()`'s type constraints to a separate type.

```ts
interface BaseStoreType { // [!code ++]
  name: string // [!code ++]
  done?: boolean // [!code ++]
} // [!code ++]

function baseStore<T extends { name: string }>() {} // [!code --]
function baseStore<T extends BaseStoreType>() { // [!code ++]
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
      isDone() { // [!code ++]
        return this.current?.done // [!code ++]
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
  
Don't forget to add `isDone(): boolean | undefined` to the generic store type's getters.

And you probably want to extend your types with the `BaseStoreType` too.

```ts{1}
interface Todo extends BaseStoreType {
  id: number
  name: string
  done: boolean
}

// ... Category as well
```

## Overriding the generic store

The generic store's properties are passed as optionals when defining the store. This means that we can override them, but they are not required (that would be undesirable).

This allows you to add a default value to the generic store's state.

```ts
export const useTodoStore = useStore<TodoStore, BaseStore<Todo>>(
  'todo',
  {
    state: { // [!code ++]
      all: [ // [!code ++]
        { id: 1, name: 'First Todo', done: false }, // [!code ++]
      ], // [!code ++]
    }, // [!code ++]
    actions: {
      remove(id: number) {
        this.all = this.all.filter(item => item.id !== id)
      },
    },
  },
  baseStore<Todo>(),
)
```

Or to disable a getter or an action.

```ts
export const useTodoStore = useStore<TodoStore, BaseStore<Todo>>(
  'todo',
  {
    getters: { // [!code ++]
      getName: undefined, // getName no longer shows up in the store // [!code ++]
    }, // [!code ++]
    actions: {
      remove(id: number) {
        this.all = this.all.filter(item => item.id !== id)
      },
    },
  },
  baseStore<Todo>(),
)
```

That's it!

Every store - including the generic store - can be split up into state, getters and actions to be defined in separate files (and potentially reused as modules). See the [Examples](/examples/basic) for a comparison.
