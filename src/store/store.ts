/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */

import { Options, Store } from "./store.interface";

/**
 * `createStore` is a function that creates a store object for managing state.
 * @see https://react.dev/reference/react/useSyncExternalStore
 */
export const createStore = <Data = any>(
  options: Options<Data> = {
    initialStore: {},
    middlewareList: [],
    debug: false,
  },
): Store<Data> => {
  const { initialStore = {}, middlewareList = [], debug = false } = options;
  if (debug) {
    middlewareList.push((id, data, _store) => {
      const datetime = new Date().toISOString();
      console.groupCollapsed(`[${datetime}] %c${id}`, "color: #0f0; font-weight: bold", data);
      console.log(`%cStore › ${id}`, "color: #f0f; font-weight: bold", data);
      console.log("%cStore", "color: #f0f; font-weight: bold", _store);
      console.trace("Callstack");
      console.groupEnd();
      return data;
    });
  }
  const store: Store<Data> = {
    _store: initialStore,
    _listenerList: [],
    _middlewareList: middlewareList,
    _emit: () => {
      for (const listener of store._listenerList) {
        listener();
      }
    },
    _reset: () => {
      store._store = {};
      store._emit();
    },
    set: (id, data, silent = false) => {
      let _data: Data = typeof data === "function" ? (data as Function)(store._store[id]) : data;
      for (const middleware of store._middlewareList) {
        _data = middleware(id, _data, store._store);
      }
      store._store = {
        ...store._store,
        [id]: _data,
      };
      if (silent === false) {
        store._emit();
      }
    },
    get: (id) => {
      return store._store[id];
    },
    subscribe: (listener) => {
      store._listenerList.push(listener);
      return () => {
        store._listenerList = store._listenerList.filter(
          (currentListener) => currentListener !== listener,
        );
      };
    },
    getSnapshot: () => {
      return store._store;
    },
  };
  return store;
};

export default {};
