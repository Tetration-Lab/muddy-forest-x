import * as wasm from "./circuits_bg.wasm";
import { __wbg_set_wasm } from "./circuits_bg.js";
__wbg_set_wasm(wasm);
export * from "./circuits_bg.js";
