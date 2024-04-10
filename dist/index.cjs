'use strict';

const pinia = require('pinia');

function filterUndefined(obj, undefinedProps) {
  return Object.keys(obj).reduce((result, key) => {
    const value = obj[key];
    if (typeof value === "object" && value !== obj && value !== null) {
      for (const subKey of Object.keys(value)) {
        if (value[subKey] === void 0)
          undefinedProps.add(subKey);
        else
          result[key] = value;
        if (undefinedProps.has(subKey))
          delete value[subKey];
      }
    }
    return result;
  }, {});
}

function createState(state) {
  return state;
}
function createGetters(getters) {
  return getters;
}
function createActions(actions) {
  return actions;
}
function defineGenericStore(store, baseStore = {}) {
  const undefinedProps = /* @__PURE__ */ new Set();
  store = filterUndefined(store, undefinedProps);
  baseStore = filterUndefined(baseStore, undefinedProps);
  return {
    state: {
      ...baseStore?.state,
      ...store?.state
    },
    getters: {
      ...baseStore?.getters,
      ...store?.getters
    },
    actions: {
      ...baseStore?.actions,
      ...store?.actions
    },
    options: {
      ...baseStore?.options,
      ...store?.options
    }
  };
}
function useStore(id, store, genericStore = {}) {
  const undefinedProps = /* @__PURE__ */ new Set();
  store = filterUndefined(store, undefinedProps);
  genericStore = filterUndefined(genericStore, undefinedProps);
  return pinia.defineStore(id, {
    state: () => ({
      ...genericStore.state,
      ...store.state
    }),
    getters: {
      ...genericStore.getters,
      ...store.getters
    },
    actions: {
      ...genericStore.actions,
      ...store.actions
    },
    ...genericStore.options,
    ...store.options
  });
}

exports.createActions = createActions;
exports.createGetters = createGetters;
exports.createState = createState;
exports.defineGenericStore = defineGenericStore;
exports.useStore = useStore;
