import { createContext, useMemo } from "react";
import { Context, Props } from "./render-state.interface";

export const RenderStateContext = createContext<Context>({
  dataHandlerExecutorInterceptors: [],
});

function RenderStateProvider({ children, dataHandlerExecutorInterceptors = [] }: Props) {
  const state = useMemo(
    () => ({
      dataHandlerExecutorInterceptors,
    }),
    [dataHandlerExecutorInterceptors],
  );
  return <RenderStateContext.Provider value={state}>{children}</RenderStateContext.Provider>;
}

export default RenderStateProvider;
