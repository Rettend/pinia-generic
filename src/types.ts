// mostly from: https://github.com/vuejs/pinia/discussions/1324#discussioncomment-2833464

import type { StateTree, Store } from 'pinia'

export type PiniaStateTree = StateTree
export type PiniaGetterTree = Record<string, (...args: any) => any>
export type PiniaActionTree = Record<string, (...args: any) => any>

export type PiniaGetterThis<TStore extends Store> = Record<string, (this: TStore) => any>
export type PiniaActionThis<TStore extends Store> = Record<string, (this: TStore, ...args: any[]) => any>

export type PickState<TStore extends Store> = TStore extends Store<string, infer TState, PiniaGetterTree, PiniaActionTree> ? TState : PiniaStateTree
export type PickGetters<TStore extends Store> = TStore extends Store<string, PiniaStateTree, infer TGetters, PiniaActionTree> ? TGetters : never
export type PickActions<TStore extends Store> = TStore extends Store<string, PiniaStateTree, PiniaGetterTree, infer TActions> ? TActions : never

type CompatiblePiniaState<TState> = () => TState

type CompatiblePiniaGetter<TGetter extends (...args: any) => any, TStore extends Store> = (this: TStore, state: PickState<TStore>) => ReturnType<TGetter>
type CompatiblePiniaGetters<TGetters extends PiniaGetterTree, TStore extends Store> = {
  [Key in keyof TGetters]: CompatiblePiniaGetter<TGetters[Key], CompatibleStore<TStore>>;
}

type CompatiblePiniaAction<TAction extends (...args: any) => any, TStore extends Store> = (this: TStore, ...args: Parameters<TAction>) => ReturnType<TAction>
type CompatiblePiniaActions<TActions extends PiniaActionTree, TStore extends Store> = {
  [Key in keyof TActions]: CompatiblePiniaAction<TActions[Key], CompatibleStore<TStore>>;
}

type CompatibleStore<TStore extends Store> = TStore extends Store<string, infer TState, infer TGetters, infer TActions> ? Store<string, TState, TGetters, TActions> : never

export type PiniaState<TStore extends Store> = CompatiblePiniaState<PickState<TStore>>
export type PiniaGetters<TStore extends Store> = CompatiblePiniaGetters<PickGetters<TStore>, TStore>
export type PiniaActions<TStore extends Store> = CompatiblePiniaActions<PickActions<TStore>, TStore>

export interface PiniaStore<TStore extends Store> {
  state: PiniaState<TStore>
  getters: PiniaGetters<TStore>
  actions: PiniaActions<TStore>
}

export type StoreId<TStore extends Store> = TStore extends Store<infer Id extends string, PiniaStateTree, PiniaGetterTree, PiniaActionTree> ? Id : never

export type ExtractStoreType<T extends Store> = T extends Store<string, infer S, infer G, infer A>
  ? { state: S; getters: G; actions: A }
  : never
