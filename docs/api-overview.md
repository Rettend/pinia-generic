---
outline: deep
---

# API Overview

## `create` functions

### `createState()`

Creates a state for a store.

<<< @/../src/generic.ts#createState

### `createGetters()`

Creates getters for a store.

<<< @/../src/generic.ts#createGetters

### `createActions()`

Creates actions for a store.

<<< @/../src/generic.ts#createActions

## `define` functions

### `defineGenericStore()`

Defines a generic store with the given state, getters, and actions.

<<< @/../src/generic.ts#defineGenericStore

### `useStore()`

Where the actual Pinia store is created. Combines the given store with a generic store.

<<< @/../src/generic.ts#useStore

## Types

### `PiniaStore<>`

Creates a type for a store or a generic store.

<<< @/../src/types.ts#PiniaStore

## Internal types

### `ExtractStore<>`

Extracts the type of a store.

<<< @/../src/types.ts#ExtractStore

### `PiniaGetterThis<>`

Type for getters that use `this` to access the store.

<<< @/../src/types.ts#PiniaGetterThis

### `PiniaActionThis<>`

Type for actions that use `this` to access the store.

<<< @/../src/types.ts#PiniaActionThis

### `StoreThis<>`

Type that combines `PiniaGetterThis` and `PiniaActionThis` with the state.

<<< @/../src/types.ts#StoreThis
