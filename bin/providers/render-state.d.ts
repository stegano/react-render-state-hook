/// <reference types="react" />
import { Context, Props } from "./render-state.interface";
import { DataHandlingState } from "../hooks/use-render-state.interface";
export declare const defaultStore: import("../store/store.interface").Store<DataHandlingState<any, any>, Record<string, DataHandlingState<any, any>>>;
export declare const RenderStateContext: import("react").Context<Context>;
declare function RenderStateProvider({ children, dataHandlerExecutorInterceptorList, store, }: Props): import("react/jsx-runtime").JSX.Element;
export default RenderStateProvider;
