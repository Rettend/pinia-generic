# Advanced Examples

Below is a non-exhaustive list of advanced examples that are proven to work.

::: tip NOTE
These are not complete examples, but snippets that showcase a specific feature.
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

We can get creative and add parameters to a generic store function:

```ts{10-12}
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
