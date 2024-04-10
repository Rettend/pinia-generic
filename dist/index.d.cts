import { Store, DefineStoreOptionsBase, StateTree, StoreDefinition } from 'pinia';

/**
 * Getters with `this` context of the store and the generic store combined.
 * Puts all of the properties into `this`, while it only requires the getters unique to the store to be defined.
 * @internal
 */
type PiniaGetterThis<TStore extends Store, TGenericStore extends Store = TStore> = {
    [K in keyof (Omit<ExtractStore<TStore>['getters'], keyof ExtractStore<TGenericStore>['getters']> & Partial<ExtractStore<TGenericStore>['getters']>)]?: ((this: TStore & NoId<TGenericStore>) => ExtractStore<TStore>['getters'][K] extends (...args: any[]) => any ? ReturnType<ExtractStore<TStore>['getters'][K]> : never) | undefined;
};
/**
 * Actions with `this` context of the store and the generic store combined.
 * Puts all of the properties into `this`, while it only requires the actions unique to the store to be defined.
 * @internal
 */
type PiniaActionThis<TStore extends Store, TGenericStore extends Store = TStore> = {
    [K in keyof (Omit<ExtractStore<TStore>['actions'], keyof ExtractStore<TGenericStore>['actions']> & Partial<ExtractStore<TGenericStore>['actions']>)]?: ((this: TStore & NoId<TGenericStore>, ...args: ExtractStore<TStore>['actions'][K] extends (...args: any[]) => any ? Parameters<ExtractStore<TStore>['actions'][K]> : never) => ExtractStore<TStore>['actions'][K] extends (...args: any[]) => any ? ReturnType<ExtractStore<TStore>['actions'][K]> : never) | undefined;
};
/**
 * Store with `this` context of the store and the generic store combined.
 * Puts all of the properties into `this`, while it only requires the ones unique to the store to be defined.
 * @internal
 */
interface StoreThis<TStore extends Store, TGenericStore extends Store = Store> {
    state?: {
        [K in keyof (Omit<ExtractStore<TStore>['state'], keyof ExtractStore<TGenericStore>['state']> & Partial<ExtractStore<TGenericStore>['state']>)]?: (Omit<ExtractStore<TStore>['state'], keyof ExtractStore<TGenericStore>['state']> & Partial<ExtractStore<TGenericStore>['state']>)[K] | undefined;
    };
    getters?: PiniaGetterThis<TStore, TGenericStore>;
    actions?: PiniaActionThis<TStore, TGenericStore>;
    options?: DefineStoreOptionsBase<ExtractStore<TStore>['state'], TStore>;
}
/**
 * Extracts the state, getters and actions from a store.
 * @template TStore - The store type.
 * @example
 * Index this type to access the state, getters and actions of a store.
 * ```ts
 * type State = ExtractStore<Store>['state']
 * ```
 * @internal
 */
type ExtractStore<TStore extends Store> = TStore extends Store<string, infer S extends StateTree, infer G, infer A> ? {
    state: S;
    getters: G;
    actions: A;
} : never;
/**
 * Define a type for a store or a generic store. Combines their properties.
 * @template Id - The store ID.
 * @template State - The store state.
 * @template Getters - The store getters.
 * @template Actions - The store actions.
 * @template TGenericStore - The generic store type.
 * @public
 */
type PiniaStore<Id extends string = string, State extends StateTree = object, Getters = object, Actions = object, TGenericStore extends Store = Store> = Store<Id, State & ExtractStore<TGenericStore>['state'], Getters & ExtractStore<TGenericStore>['getters'], Actions & ExtractStore<TGenericStore>['actions']>;
type NoId<TStore extends Partial<Store>> = Omit<TStore, '$id'>;

/**
 * Creates a state object for a store.
 * @template TStore - The store type.
 * @template TGenericStore - The generic store type.
 * @param state - The state object.
 */
declare function createState<TStore extends Store, TGenericStore extends Store = Store>(state: {
    [K in keyof (Omit<ExtractStore<TStore>['state'], keyof ExtractStore<TGenericStore>['state']> & Partial<ExtractStore<TGenericStore>['state']>)]: (Omit<ExtractStore<TStore>['state'], keyof ExtractStore<TGenericStore>['state']> & Partial<ExtractStore<TGenericStore>['state']>)[K] | undefined;
}): ExtractStore<TStore>['state'];
/**
 * Creates a getters object for a store.
 * @template TStore - The store type.
 * @template TGenericStore - The generic store type.
 * @param getters - The getters object.
 */
declare function createGetters<TStore extends Store, TGenericStore extends Store = Store>(getters: PiniaGetterThis<TStore, TGenericStore>): ExtractStore<TStore>['getters'];
/**
 * Creates an actions object for a store.
 * @template TStore - The store type.
 * @template TGenericStore - The generic store type.
 * @param actions - The actions object.
 */
declare function createActions<TStore extends Store, TGenericStore extends Store = Store>(actions: PiniaActionThis<TStore, TGenericStore>): ExtractStore<TStore>['actions'];
/**
 * Defines a generic store.
 * @template TStore - The store type.
 * @param store - The store object.
 * @param baseStore - Another base store to extend.
 */
declare function defineGenericStore<TStore extends Store, TGenericStore extends Store = Store>(store: StoreThis<TStore, TGenericStore>, baseStore?: StoreThis<TGenericStore>): StoreThis<TStore>;
/**
 * Defines a store. Can extend a generic store.
 * @template TStore - The store type.
 * @template TGenericStore - The generic store type.
 * @param id - The store id.
 * @param store - The store object.
 * @param genericStore - The generic store object.
 */
declare function useStore<TStore extends Store, TGenericStore extends Store = Store>(id: TStore['$id'], store: StoreThis<TStore, TGenericStore>, genericStore?: StoreThis<TGenericStore>): StoreDefinition<TStore["$id"], ExtractStore<TStore>["state"], ExtractStore<TStore>["getters"], ExtractStore<TStore>["actions"]>;

export { type ExtractStore, type NoId, type PiniaActionThis, type PiniaGetterThis, type PiniaStore, type StoreThis, createActions, createGetters, createState, defineGenericStore, useStore };
