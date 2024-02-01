import { createContext, useMemo } from "react";
import { Context, Props } from "./render-state.interface";
import { createStore } from "../store/store";
import { DataHandlingState } from "../hooks/use-render-state.interface";

export const defaultStore = createStore<DataHandlingState<any, any>>();

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
  dataHandlerExecutorInterceptorList,
  store = defaultStore,
}: Props) {
  const state = useMemo(
    () => ({
      getDataHandlerExecutorInterceptorList: () => {
        return dataHandlerExecutorInterceptorList !== undefined
          ? dataHandlerExecutorInterceptorList
          : [];
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
