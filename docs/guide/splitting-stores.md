---
outline: deep
---

# Splitting Stores

Pinia Generic has 3 functions to define the state, getters and actions of a store independently.

- `createState()`
- `createGetters()`
- `createActions()`

## Simple store

### `PiniaStore<>` type

First we create a type for the store. This will be used to type the `this` parameter in the getters and actions.

```ts
import type { PiniaStore } from 'pinia-generic'

type CategoryStore = PiniaStore<
  'category',
  {
    id: number
    name: string
  },
  {
    getId: () => number
    getName: () => string
  }
>
```

The `PiniaStore<>` type takes 5 optional generic parameters:

1. The name of the store (this is the id passed to `defineStore()`)
2. State
3. Getters
4. Actions
5. Generic store to extend

> **Note**: this is a wrapper around the `Store<>` type from Pinia, with the last Generic store parameter, so if you are just splitting your stores, you can use the `Store<>` type directly.

You can of course split this type up too.

```ts
interface CategoryState { // or call it Category if it's an existing type
  id: number
  name: string
}

// ...

type CategoryStore = Store<
  'category',
  CategoryState,
  CategoryGetters,
>
```

::: warning
Here we only have a state and getters, showing how the generic parameters are optional.

**Optional generic types cannot be skipped though, so you will need to pass an empty object: `{}`.**

```ts
type CategoryStore = Store<
  'category',
  CategoryState,
  object,
  CategoryActions,
>
```

:::

### State and getters

Then we implement the state and the getters.

`createState()`, `createGetters()` and `createActions()` are generic functions that take the store type as a parameter, and return the state and getters objects.

```ts
import { createGetters, createState } from 'pinia-generic'

const state = createState<CategoryStore>({
  id: 0,
  name: 'Hi',
})

const getters = createGetters<CategoryStore>({
  getId() {
    return this.id
  },
  getName() {
    return this.name
  },
})
```

::: tip NOTE
The whole point of this package is to properly type the `this` parameter, and the object passed to the `create` functions. If you misspell a property, or forget to add it, you will get a type error.
:::

Because we are passing the `CategoryStore` type to the `create` functions, the state and getters objects are entirely independent from each other, so you can put them in separate files.

### It's all coming together

Finally, we export and import them, and create the store.

```ts
import { defineStore } from 'pinia'
import { state } from './state'
import { getters } from './getters'

export const useCategoryStore = defineStore('category', {
  state: () => state,
  getters,
})
```

> **Note**: the state needs to be an arrow function for `defineStore()`.

We only worked **_on top of_** Pinia, so the store can be used like any other.

```ts
const category = useCategoryStore()

const id = category.getId

category.name = 'Hello'
```
