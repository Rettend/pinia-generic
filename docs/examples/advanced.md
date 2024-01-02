# Advanced Examples

Below is a non-exhaustive list of advanced examples that are proven to work.

::: tip NOTE
These may not complete examples, but snippets that showcase a specific feature.
:::

## Plugins and store options

Options added by plugins that you use will be forwarded to the store's options.

Let's try that with the best plugin:

```ts{10-12}
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// ...

export const useTestStore = useStore<TestStore>('test', {
  state: {
    someState: 'hello pinia',
  },
  options: {
    persist: true, // properly typed and works 👍
  },
})
```

We can get creative and add parameters to the generic store function:

```ts{8-10,21}
function baseStore<T extends Category>(
  persist = false,
) {
  return defineGenericStore<BaseStore<T>>({
    state: {
      someState: '',
    },
    options: {
      persist,
    },
  })
}

export const useCategoryStore = useStore<CategoryStore, BaseStore<Category>>(
  'category',
  {
    state: {
      someState: 'hello pinia',
    },
  },
  baseStore<Category>(true),
)
```

## Multi-level inheritance

Not just regular stores can extend generic stores, but generic stores can extend other generic stores as well.

Here is the first generic store:

```ts
interface BaseItem {
  id: number
}

type BaseStore1<T extends BaseItem> = PiniaStore<
  'base1',
  {
    value1: T | null
  }
>

function baseStore1<T extends BaseItem>() {
  return defineGenericStore<BaseStore1<T>>({
    state: {
      value1: null,
    },
  })
}
```

To extend it, pass the generic store as the last parameter to `defineGenericStore()`:

```ts{8,17}

type BaseStore2<T extends BaseItem> = PiniaStore<
  'base2',
  {
    value2: T | null
  },
  {},
  {},
  BaseStore1<T> // Note this line
>

function baseStore2<T extends BaseItem>() {
  return defineGenericStore<BaseStore2<T>, BaseStore1<T>>({
    state: {
      value2: null,
    },
  },
  baseStore1<T>(), // Note this line
  )
}
```

::: tip IMPORTANT
It can be easy to mess up the order of the generic parameters.

```ts
return defineGenericStore<BaseStore2<T>, BaseStore1<T>>({})
```

A good way to think about it is that the first is **the store I am currently defining** and the second is the **store whose properties it will inherit**.
:::

Now a store only needs to extend `BaseStore2` to get all the state and getters from `BaseStore1` and `BaseStore2`:

```ts
type MyStore = PiniaStore<
  'mystore',
  {},
  {
    getValue1(): BaseItem | null
    getValue2(): BaseItem | null
  },
  {
  },
  BaseStore2<BaseItem>
>

const useMyStore = useStore<MyStore, BaseStore2<BaseItem>>(
  'mystore',
  {
    getters: {
      getValue1() {
        return this.value1
      },
      getValue2() {
        return this.value2
      },
    },
  },
)
```
