<!-- flex center the image and text below each other-->
<p align="center" style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
  <img src="./docs/public/pinia-generic.svg" alt="pinia-generic" width="200"/>
  <a href="https://github.com/vuejs/pinia">
    <i>Pinia</i>
  </a>
</p>

# Pinia Generic Store

[![npm](https://img.shields.io/npm/v/pinia-generic?color=blue)](https://www.npmjs.com/package/pinia-generic)

- 🧩 Create generic stores that can be reused, massively reducing duplicate code in large projects
- 📁 Split stores into multiple files, so relevant code can be grouped together
- 📦 Use store inheritance to create a hierarchy of generic stores

## Installation

```bash
npm i pinia-generic
```

## Usage

See the [Guide](https://rettend.github.io/pinia-generic/guide/getting-started) for a detailed walkthrough.

### Generic Store

When your project has multiple stores that share a lot of common logic, you can create a generic store that can be reused by all of them.

Use `defineGenericStore()` to create a generic store.

```ts
import type { PiniaStore } from 'pinia-generic'
import { defineGenericStore, useStore } from 'pinia-generic'

type BaseStore<T> = PiniaStore<
  'base',
  {
    current: T | null
    all: T[]
  },
  {
    getName: () => string | undefined
  },
  {
    add: (item: T) => void
  }
>

interface BaseType {
  name: string
}

function baseStore<T extends BaseType>() {
  return defineGenericStore<BaseStore<T>>({
    state: {
      current: null,
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
```

We have two stores (Catergory and Product) that extend the generic store.

Use `useStore()` to create a store that extends the generic store.

```ts
interface Category extends BaseType {
  id: number
  name: string
}

type CategoryStore = PiniaStore<
  'category',
  {
    description: string
  },
  {
    getMaxId: () => number
  },
  object,
  BaseStore<Category>
>

const useCategoryStore = useStore<CategoryStore, BaseStore<Category>>(
  'category',
  {
    state: {
      description: 'This is a category',
    },
    getters: {
      getMaxId() {
        return this.all.reduce((max, item) => Math.max(max, item.id), 0)
      },
    },
  },
  baseStore<Category>(),
)

interface Product extends BaseType {
  id: number
  name: string
  price: number
}

type ProductStore = PiniaStore<
  'product',
  object,
  {
    getTotal: () => number
  },
  {
    remove: (id: number) => void
  },
  BaseStore<Product>
>

const useProductStore = useStore<ProductStore, BaseStore<Product>>(
  'product',
  {
    state: {
      all: [{ id: 1, name: 'Laptop', price: 50 }],
    },
    getters: {
      getTotal() {
        return this.all.reduce((total, item) => total + item.price, 0)
      },
    },
    actions: {
      remove(id: number) {
        this.all = this.all.filter(item => item.id !== id)
      },
    },
  },
  baseStore<Product>(),
)
```

We only worked on top of Pinia, because `useStore()` uses Pinia's `defineStore()` these can be used like regular Pinia stores.

Both stores will have all the generic store's state, getters and actions.

```ts
const product = useProductStore()
const category = useCategoryStore()

product.add({
  id: product.getMaxId() + 1,
  name: 'Phone',
  price: 40,
})

product.getTotal() // 90
```

### Splitting Stores

Stores can be split into multiple files using `createState()`, `createGetters()` and `createActions()`.

First we need a type for the store. This will be used to type the `this` parameter in the getters and actions.

```ts
// types.ts
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

We have the state, getters and actions in separate files.

```ts
import type { CategoryStore } from './types'
// state.ts
import { createState } from 'pinia-generic'

const state = createState<CategoryStore>({
  id: 0,
  name: 'Category',
})
```

```ts
import type { CategoryStore } from './types'
// getters.ts
import { createGetters } from 'pinia-generic'

const getters = createGetters<CategoryStore>({
  getId() {
    return this.id
  },
  getName() {
    return this.name
  },
})
```

And finally we create the store.

```ts
// store.ts
import { defineStore } from 'pinia'
import { getters } from './getters'
import { state } from './state'

export const useCategoryStore = defineStore('category', {
  state: () => state,
  getters,
})
```

Note that there was nothing generic here, so we can use Pinia's `defineStore()` instead of `useStore()`.

## License

MIT
