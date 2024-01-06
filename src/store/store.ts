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
  },
): Store<Data> => {
  const { initialStore = {}, middlewareList = [] } = options;

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
    set: (id, data) => {
      let _data: Data = typeof data === "function" ? (data as Function)(store._store[id]) : data;
      for (const middleware of store._middlewareList) {
        _data = middleware(id, _data, store._store);
      }
      store._store = {
        ...store._store,
        [id]: _data,
      };
      store._emit();
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
