import { createContext, useMemo } from "react";
import { Context, Props } from "./render-state.interface";
import { createStore } from "../store/store";

export const defaultStore = createStore();

export const RenderStateContext = createContext<Context>({
  getDataHandlerExecutorInterceptorList: () => {
    return [];
  },
  getStroe: () => {
    return defaultStore;
  },
});

function RenderStateProvider({
  children,
  dataHandlerExecutorInterceptorList = [],
  store = defaultStore,
}: Props) {
  const state = useMemo(
    () => ({
      getDataHandlerExecutorInterceptorList: () => {
        return dataHandlerExecutorInterceptorList;
      },
      getStroe: () => {
        return store;
      },
    }),
    [dataHandlerExecutorInterceptorList, store],
  );
  return <RenderStateContext.Provider value={state}>{children}</RenderStateContext.Provider>;
}

export default RenderStateProvider;
