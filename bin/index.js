/*! For license information please see index.js.LICENSE.txt */
!function(e,t){if("object"==typeof exports&&"object"==typeof module)module.exports=t(require("react"));else if("function"==typeof define&&define.amd)define(["react"],t);else{var r="object"==typeof exports?t(require("react")):t(e.react);for(var o in r)("object"==typeof exports?exports:e)[o]=r[o]}}(global,(e=>(()=>{"use strict";var t={251:(e,t,r)=>{var o=r(156),a=Symbol.for("react.element"),s=(Symbol.for("react.fragment"),Object.prototype.hasOwnProperty),n=o.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,i={key:!0,ref:!0,__self:!0,__source:!0};t.jsx=function(e,t,r){var o,u={},c=null,d=null;for(o in void 0!==r&&(c=""+r),void 0!==t.key&&(c=""+t.key),void 0!==t.ref&&(d=t.ref),t)s.call(t,o)&&!i.hasOwnProperty(o)&&(u[o]=t[o]);if(e&&e.defaultProps)for(o in t=e.defaultProps)void 0===u[o]&&(u[o]=t[o]);return{$$typeof:a,type:e,key:c,ref:d,props:u,_owner:n.current}}},893:(e,t,r)=>{e.exports=r(251)},156:t=>{t.exports=e}},r={};function o(e){var a=r[e];if(void 0!==a)return a.exports;var s=r[e]={exports:{}};return t[e](s,s.exports,o),s.exports}o.d=(e,t)=>{for(var r in t)o.o(t,r)&&!o.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},o.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),o.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var a={};return(()=>{o.r(a),o.d(a,{IRenderState:()=>e,IRenderStateContext:()=>t,RenderStateContext:()=>i,RenderStateProvider:()=>u,useRenderState:()=>d});var e={};o.r(e),o.d(e,{DataHandlingStatus:()=>r});var t={};o.r(t);var r,s=o(156);!function(e){e.IN_PROGRESS="IN_PROGRESS",e.SUCCEEDED="SUCCEEDED",e.FAILED="FAILED"}(r||(r={}));var n=o(893);const i=(0,s.createContext)({dataHandlerExecutorInterceptors:[]}),u=function({children:e,dataHandlerExecutorInterceptors:t=[]}){const r=(0,s.useMemo)((()=>({dataHandlerExecutorInterceptors:t})),[t]);return(0,n.jsx)(i.Provider,{value:r,children:e})},c=((e={middlewareList:[]})=>{const t={_store:{},_listenerList:[],_middlewareList:e.middlewareList,_emit:()=>{for(const e of t._listenerList)e()},set:(e,r)=>{let o="function"==typeof r?r(t._store[e]):r;for(const r of t._middlewareList)o=r(e,o,t._store);t._store={...t._store,[e]:o},t._emit()},get:e=>t._store[e],subscribe:e=>(t._listenerList.push(e),()=>{t._listenerList=t._listenerList.filter((t=>t!==e))}),getSnapshot:()=>t._store};return t})(),d=(e={},t=void 0)=>{const o=(0,s.useId)(),a=(0,s.useMemo)((()=>t??o),[t,o]),n=(0,s.useSyncExternalStore)(c.subscribe,c.getSnapshot,c.getSnapshot),u=(0,s.useMemo)((()=>a in n?n[a]:"default"in e?{status:r.SUCCEEDED,data:e.default}:{status:r.IN_PROGRESS}),[n,a,e]),d=(0,s.useContext)(i),f=(0,s.useCallback)((async(e,t)=>{try{const{dataHandlerExecutorInterceptors:o}=d;if(o.length>0){let s;for(const n of o){const o=await s;s=n(o,e,t),s instanceof Promise&&c.set(a,(e=>({promise:s,data:e?.data,previousData:e?.previousData,status:r.IN_PROGRESS})))}const n=await s;return c.set(a,(e=>({data:n,previousData:e?.data,status:r.SUCCEEDED}))),n}const s=e(c.get(a)?.data),n=s instanceof Promise?s:Promise.resolve(s);s instanceof Promise&&c.set(a,(e=>({data:e?.data,previousData:e?.previousData,status:r.IN_PROGRESS,promise:n})));const i=await n;return c.set(a,(e=>({data:i,previousData:e?.data,status:r.SUCCEEDED}))),i}catch(e){const t=e;throw c.set(a,(e=>({error:t,data:e?.data,previousData:e?.previousData,status:r.FAILED}))),e}}),[d,a]);return[(0,s.useCallback)(((t,o,a)=>{const{data:s,previousData:n,status:i,error:c,promise:d}=u;switch(i){case r.SUCCEEDED:return"function"==typeof t?t(s??e.default,n):t||null;case r.FAILED:if(void 0===typeof a&&c instanceof Error)throw c;if(void 0===c)throw new Error("The `ProcessError` is undefined");return"function"==typeof a?a(c,n):a||null;case r.IN_PROGRESS:default:return"function"==typeof o?o(d,n):o}}),[u,e.default]),f,u]}})(),a})()));