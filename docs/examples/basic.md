# Basic Example

A basic generic store and a store that extends it.

## Generic Store

[Store type](/guide/generic-stores#simple-generic-store)

::: code-group

```ts [inline]
type ProductStore<T> = PiniaStore<'product',
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
```

```ts [split]
interface ProductState<T> {
  all: T[]
}

interface ProductGetters {
  getTotal(): number
  getMaxPrice(): number
}

interface ProductActions<T> {
  add(item: T): void
}

type ProductStore<T> = PiniaStore<'product',
  ProductState<T>,
  ProductGetters,
  ProductActions<T>
>
```

:::

[Store function](/guide/generic-stores#definegenericstore-function)

::: code-group

```ts [inline]
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
```

```ts [split]
function productState<T>() {
  return createState<ProductStore<T>>({
    all: [],
  })
}

function productGetters<T extends Book>() {
  return createGetters<ProductStore<T>>({
    getTotal() {
      return this.all.reduce((total, item) => total + item.price, 0)
    },
    getMaxPrice() {
      return this.all.reduce((max, item) => Math.max(max, item.price), 0)
    },
  })
}

function productActions<T>() {
  return createActions<ProductStore<T>>({
    add(item: T) {
      this.all.push(item)
    },
  })
}

function productStore<T extends Book>() {
  return defineGenericStore<ProductStore<T>>({
    state: productState<T>(),
    getters: productGetters<T>(),
    actions: productActions<T>(),
  })
}
```

:::

## Using the Generic Store

Type that will go in the place of `T`.

```ts
interface Book {
  id: number
  name: string
  price: number
}
```

Store type

::: code-group

```ts [inline]
type BookStore = PiniaStore<'book',
  {
    active: Book | null
  },
  {
    getAveragePrice(): number
  },
  {},
  ProductStore<Book>
>
```

```ts [split]
interface BookState {
  active: Book | null
}

interface BookGetters {
  getAveragePrice(): number
}

type BookStore = PiniaStore<'book',
  BookState,
  BookGetters,
  {},
  ProductStore<Book>
>
```

:::

Creating the [store](/guide/generic-stores.html#usestore-function)

::: code-group

```ts [inline]
export const useBookStore = useStore<BookStore, ProductStore<Book>>('book', {
  state: {
    active: null,
    all: [
      { id: 1, name: 'The Lord of the Rings', price: 20 },
      { id: 2, name: 'The Hitchhiker\'s Guide to the Galaxy', price: 42 },
      { id: 3, name: 'The Little Prince', price: 10 },
    ],
  },
  getters: {
    getAveragePrice() {
      return this.getTotal / this.all.length
    },
  },
},
productStore<Book>(),
)
```

```ts [split]
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

export const useBookStore = useStore<BookStore, ProductStore<Book>>('book', {
  state: bookState,
  getters: bookGetters,
},
productStore<Book>(),
)
```

:::

## Resulting Store

![basic store](/basic-store.png)
