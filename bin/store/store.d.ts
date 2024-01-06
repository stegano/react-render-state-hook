import { Options, Store } from "./store.interface";
/**
 * `createStore` is a function that creates a store object for managing state.
 * @see https://react.dev/reference/react/useSyncExternalStore
 */
export declare const createStore: <Data = any>(options?: Options<Data>) => Store<Data, Record<string, Data>>;
declare const _default: {};
export default _default;
