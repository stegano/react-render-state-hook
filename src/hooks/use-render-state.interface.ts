import { ReactNode } from "react";

export enum DataHandlingStatus {
  IDLE = "IDLE",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  FAILURE = "FAILURE",
}

export interface DataHandlerExecutor<Data extends any = any> {
  (previousData?: Data): Promise<Data> | Data;
}

export interface DataHandler<Data> {
  (executor: DataHandlerExecutor<Data>, executorId?: string): Promise<Data>;
}

export type RenderWhenDataHandlingIdle<Data> = ReactNode | ((previousData?: Data) => ReactNode);

export type RenderWhenDataHandlingCompleted<Data> =
  | ReactNode
  | ((data: Data, previousData?: Data) => ReactNode);

export type RenderWhenDataHandlingInProgress<Data> =
  | ReactNode
  | ((data?: Promise<Data>, previousData?: Data) => ReactNode);

export type RenderWhenDataHandlingFailure<
  DataHandlingError extends Error | unknown = unknown,
  Data extends any = any,
> = ReactNode | ((error: DataHandlingError, previousData?: Data) => ReactNode);

export interface Render<Data = any, DataHandlingError = any> {
  (
    renderWhenDataHandlingCompleted?: RenderWhenDataHandlingCompleted<Data>,
    renderWhenDataHandlingIdle?: RenderWhenDataHandlingIdle<Data>,
    renderWhenDataHandlingInProgress?: RenderWhenDataHandlingInProgress<Data>,
    renderWhenDataHandlingFailure?: RenderWhenDataHandlingFailure<DataHandlingError, Data>,
  ): ReactNode;
}

export interface DataHandlingState<Data, DataHandlingError> {
  status: DataHandlingStatus;
  error?: DataHandlingError;
  promise?: Promise<Data>;
  data?: Data;
  previousData?: Data;
}

export type Renderer<Data, DataHandlingError> = [
  render: Render<Data, DataHandlingError>,
  handleData: DataHandler<Data>,
  dataHandlingState: DataHandlingState<Data, DataHandlingError>,
];

export interface Options<Data extends any = any> {
  default?: Data;
}
