/* eslint-disable no-restricted-syntax */
import { useCallback, useContext, useMemo, useSyncExternalStore, useId } from "react";
import {
  DataHandlingStatus,
  type Render,
  type Renderer,
  type DataHandler,
  DataHandlingState,
  Options,
} from "./use-render-state.interface";
import { RenderStateContext } from "../contexts";
import type { IRenderStateContext } from "../contexts";
import { Store } from "../store";

const store = Store.createStore<DataHandlingState<any, any>>();

const useRenderState = <Data extends any = any, DataHandlingError = Error | unknown>(
  options: Options<Data> = {},
  key: string | undefined = undefined,
): Renderer<Data, DataHandlingError> => {
  const hookId = useId();
  const currentHookKey = useMemo(() => key ?? hookId, [key, hookId]);
  const globalState = useSyncExternalStore<
    Record<string, DataHandlingState<Data, DataHandlingError>>
  >(store.subscribe, store.getSnapshot, store.getSnapshot);
  const state = useMemo<DataHandlingState<Data, DataHandlingError>>(() => {
    if (currentHookKey in globalState) {
      return globalState[currentHookKey];
    }
    if ("default" in options) {
      return {
        status: DataHandlingStatus.COMPLETED,
        data: options.default,
      };
    }
    return { status: DataHandlingStatus.IN_PROGRESS };
  }, [globalState, currentHookKey, options]);

  const context = useContext<IRenderStateContext.Context>(RenderStateContext);

  const handleData: DataHandler<Data> = useCallback(
    async (dataHandlerExecutor, executorId?: string) => {
      try {
        const { dataHandlerExecutorInterceptors } = context;
        if (dataHandlerExecutorInterceptors.length > 0) {
          let promise: Promise<any> | undefined;
          for (const dataProcessingHandler of dataHandlerExecutorInterceptors) {
            // eslint-disable-next-line no-await-in-loop
            const previousData = await promise;
            promise = dataProcessingHandler(previousData, dataHandlerExecutor, executorId);
            if (promise instanceof Promise) {
              // eslint-disable-next-line @typescript-eslint/no-loop-func
              store.set(currentHookKey, (prev) => {
                return {
                  promise,
                  data: prev?.data,
                  previousData: prev?.previousData,
                  status: DataHandlingStatus.IN_PROGRESS,
                };
              });
            }
          }
          const data = await promise;
          store.set(currentHookKey, (prev) => ({
            data,
            previousData: prev?.data,
            status: DataHandlingStatus.COMPLETED,
          }));
          return data;
        }
        const evaludatedData = dataHandlerExecutor(store.get(currentHookKey)?.data);
        const promise =
          evaludatedData instanceof Promise ? evaludatedData : Promise.resolve(evaludatedData);
        if (evaludatedData instanceof Promise) {
          store.set(currentHookKey, (prev) => ({
            data: prev?.data,
            previousData: prev?.previousData,
            status: DataHandlingStatus.IN_PROGRESS,
            promise,
          }));
        }
        const data = await promise;
        store.set(currentHookKey, (prev) => ({
          data,
          previousData: prev?.data,
          status: DataHandlingStatus.COMPLETED,
        }));
        return data;
      } catch (e) {
        const error = e as DataHandlingError;
        store.set(currentHookKey, (prev) => ({
          error,
          data: prev?.data,
          previousData: prev?.previousData,
          status: DataHandlingStatus.FAILURE,
        }));
        throw e;
      }
    },
    [context, currentHookKey],
  );

  const render: Render<Data, DataHandlingError> = useCallback(
    (
      renderWhenDataHandlingSucceeded,
      renderWhenDataHandlingInProgress,
      renderWhenDataHandlingFailed,
    ) => {
      const { data, previousData, status, error, promise } = state;
      switch (status) {
        case DataHandlingStatus.COMPLETED: {
          return typeof renderWhenDataHandlingSucceeded === "function"
            ? renderWhenDataHandlingSucceeded((data ?? options.default) as Data, previousData)
            : renderWhenDataHandlingSucceeded || null;
        }
        case DataHandlingStatus.FAILURE: {
          if (typeof renderWhenDataHandlingFailed === undefined) {
            /**
             * Propagate the error upwards if the error component does not exist,
             * so that it can be handled at the error boundary.
             */
            if (error instanceof Error) {
              throw error;
            }
          }
          if (typeof error === "undefined") {
            throw new Error("The `ProcessError` is undefined");
          }
          return typeof renderWhenDataHandlingFailed === "function"
            ? renderWhenDataHandlingFailed(error, previousData)
            : renderWhenDataHandlingFailed || null;
        }
        case DataHandlingStatus.IN_PROGRESS:
        default: {
          return typeof renderWhenDataHandlingInProgress === "function"
            ? renderWhenDataHandlingInProgress(promise, previousData)
            : renderWhenDataHandlingInProgress;
        }
      }
    },
    [state, options.default],
  );

  return [render, handleData, state];
};

export default useRenderState;
