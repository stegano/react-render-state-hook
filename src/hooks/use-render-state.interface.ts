import { ReactNode } from "react";

export enum DataHandlingStatus {
  IN_PROGRESS = "IN_PROGRESS",
  SUCCEEDED = "SUCCEEDED",
  FAILED = "FAILED",
}

export interface DataHandlerExecutor<Data extends any = any> {
  (previousData?: Data): Promise<Data> | Data;
}

export interface DataHandler<Data> {
  (executor: DataHandlerExecutor<Data>, id?: string): Promise<Data>;
}

export type RenderWhenDataHandlingSucceeded<Data> =
  | ReactNode
  | ((data: Data, previousData?: Data) => ReactNode);

export type RenderWhenDataHandlingInProgress<Data> =
  | ReactNode
  | ((data?: Promise<Data>, previousData?: Data) => ReactNode);

export type RenderWhenDataHandlingFailed<
  DataHandlingError extends Error | unknown = unknown,
  Data extends any = any,
> = ReactNode | ((error: DataHandlingError, previousData?: Data) => ReactNode);

export interface Render<Data = any, DataHandlingError = any> {
  (
    renderWhenDataHandlingSucceeded?: RenderWhenDataHandlingSucceeded<Data>,
    renderWhenDataHandlingInProgress?: RenderWhenDataHandlingInProgress<Data>,
    renderWhenDataHandlingFailed?: RenderWhenDataHandlingFailed<DataHandlingError, Data>,
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
