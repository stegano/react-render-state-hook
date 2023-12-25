import { type Renderer, Options } from "./use-render-state.interface";
declare const useRenderState: <Data extends unknown = any, DataHandlingError = unknown>(options?: Options<Data>, key?: string | undefined) => Renderer<Data, DataHandlingError>;
export default useRenderState;
