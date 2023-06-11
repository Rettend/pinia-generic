# Basic Example

::: tip NOTE
I skipped the imports for brevity.
:::

## Generic Store

[Store type](/guide/generic-stores#simple-generic-store)

```ts
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
```

[Store function](/guide/generic-stores#definegenericstore-function)

```ts
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

```ts
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
```

Creating the state and getters

```ts
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
```

Creating the store

```ts
export const useBookStore = useStore<BookStore, ProductStore<Book>>(
  'book',
  {
    state: bookState,
    getters: bookGetters,
  },
  productStore<Book>(),
)
```

## Resulting Store

![basic store](/public/basic-store.png)
