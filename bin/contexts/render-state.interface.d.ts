import { PropsWithChildren } from "react";
import type { DataHandlerExecutor } from "../hooks/use-render-state.interface";
export interface DataHandlerExecutorInterceptor<Data extends any = any> {
    (dataHandlerExecutor: DataHandlerExecutor<Data>, previousData?: Data, executorId?: string): Promise<Data>;
}
export interface Context<Data extends any = any> {
    dataHandlerExecutorInterceptors: DataHandlerExecutorInterceptor<Data>[];
}
export type Props = PropsWithChildren<Context>;
