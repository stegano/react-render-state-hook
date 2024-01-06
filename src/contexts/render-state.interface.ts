import { PropsWithChildren } from "react";
import type { DataHandlerExecutor } from "../hooks/use-render-state.interface";

export interface DataHandlerExecutorInterceptor<Data extends any = any> {
  (
    dataHandlerExecutor: DataHandlerExecutor<Data>,
    previousData?: Data,
    executorId?: string,
  ): ReturnType<typeof dataHandlerExecutor>;
}

export interface Context<Data extends any = any> {
  dataHandlerExecutorInterceptors: DataHandlerExecutorInterceptor<Data>[];
}

export type Props = PropsWithChildren<Partial<Context>>;
