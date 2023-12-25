/// <reference types="react" />
import { Context, Props } from "./render-state.interface";
export declare const RenderStateContext: import("react").Context<Context<any>>;
declare function RenderStateProvider({ children, dataHandlerExecutorInterceptors }: Props): import("react/jsx-runtime").JSX.Element;
export default RenderStateProvider;
