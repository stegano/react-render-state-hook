/*! For license information please see index.js.LICENSE.txt */
!function(e,t){if("object"==typeof exports&&"object"==typeof module)module.exports=t(require("react"));else if("function"==typeof define&&define.amd)define(["react"],t);else{var r="object"==typeof exports?t(require("react")):t(e.react);for(var o in r)("object"==typeof exports?exports:e)[o]=r[o]}}(global,(e=>(()=>{"use strict";var t={251:(e,t,r)=>{var o=r(156),a=Symbol.for("react.element"),s=(Symbol.for("react.fragment"),Object.prototype.hasOwnProperty),n=o.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,i={key:!0,ref:!0,__self:!0,__source:!0};t.jsx=function(e,t,r){var o,u={},c=null,l=null;for(o in void 0!==r&&(c=""+r),void 0!==t.key&&(c=""+t.key),void 0!==t.ref&&(l=t.ref),t)s.call(t,o)&&!i.hasOwnProperty(o)&&(u[o]=t[o]);if(e&&e.defaultProps)for(o in t=e.defaultProps)void 0===u[o]&&(u[o]=t[o]);return{$$typeof:a,type:e,key:c,ref:l,props:u,_owner:n.current}}},893:(e,t,r)=>{e.exports=r(251)},156:t=>{t.exports=e}},r={};function o(e){var a=r[e];if(void 0!==a)return a.exports;var s=r[e]={exports:{}};return t[e](s,s.exports,o),s.exports}o.d=(e,t)=>{for(var r in t)o.o(t,r)&&!o.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},o.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),o.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var a={};return(()=>{o.r(a),o.d(a,{IRenderState:()=>e,IRenderStateContext:()=>r,RenderStateContext:()=>d,RenderStateProvider:()=>f,Store:()=>t,useRenderState:()=>p});var e={};o.r(e),o.d(e,{DataHandlingStatus:()=>s});var t={};o.r(t),o.d(t,{createStore:()=>u,default:()=>c});var r={};o.r(r);var s,n=o(156);!function(e){e.IDLE="IDLE",e.IN_PROGRESS="IN_PROGRESS",e.COMPLETED="COMPLETED",e.FAILURE="FAILURE"}(s||(s={}));var i=o(893);const u=(e={initialStore:{},middlewareList:[],debug:!1})=>{const{initialStore:t={},middlewareList:r=[],debug:o=!1}=e;o&&r.push(((e,t,r)=>{const o=(new Date).toISOString();return console.groupCollapsed(`[${o}] %c${e}`,"color: #0f0; font-weight: bold",t),console.log(`%cStore › ${e}`,"color: #f0f; font-weight: bold",t),console.log("%cStore","color: #f0f; font-weight: bold",r),console.trace("Callstack"),console.groupEnd(),t}));const a={_store:t,_listenerList:[],_middlewareList:r,_emit:()=>{for(const e of a._listenerList)e()},_reset:()=>{a._store={},a._emit()},set:(e,t)=>{let r="function"==typeof t?t(a._store[e]):t;for(const t of a._middlewareList)r=t(e,r,a._store);a._store={...a._store,[e]:r},a._emit()},get:e=>a._store[e],subscribe:e=>(a._listenerList.push(e),()=>{a._listenerList=a._listenerList.filter((t=>t!==e))}),getSnapshot:()=>a._store};return a},c={},l=u(),d=(0,n.createContext)({getDataHandlerExecutorInterceptorList:()=>[],getStroe:()=>l}),f=function({children:e,dataHandlerExecutorInterceptorList:t=[],store:r=l}){const o=(0,n.useMemo)((()=>({getDataHandlerExecutorInterceptorList:()=>t,getStroe:()=>r})),[t,r]);return(0,i.jsx)(d.Provider,{value:o,children:e})},p=(e={},t=void 0)=>{const r=(0,n.useId)(),o=(0,n.useMemo)((()=>t??r),[t,r]),a=(0,n.useContext)(d),i=(0,n.useMemo)((()=>a.getStroe()),[a]),u=(0,n.useSyncExternalStore)(i.subscribe,i.getSnapshot,i.getSnapshot),c=(0,n.useMemo)((()=>o in u?u[o]:"default"in e?{status:s.COMPLETED,data:e.default}:{status:s.IDLE}),[u,o,e]),l=(0,n.useCallback)((async(e,t)=>{try{const{getDataHandlerExecutorInterceptorList:r}=a,n=r();if(n.length>0){let r;for(let a=0;a<n.length;a+=1){const u=(0,n[a])(r,e,t);if(0===a&&u instanceof Promise&&i.set(o,(e=>({promise:u,data:e?.data,previousData:e?.previousData,status:s.IN_PROGRESS}))),r=await u,i.set(o,(e=>({data:r,previousData:e?.data,status:s.COMPLETED}))),a===n.length-1)return await u}}const u=e(i.get(o)?.data),c=u instanceof Promise?u:Promise.resolve(u);u instanceof Promise&&i.set(o,(e=>({data:e?.data,previousData:e?.previousData,status:s.IN_PROGRESS,promise:c})));const l=await c;return i.set(o,(e=>({data:l,previousData:e?.data,status:s.COMPLETED}))),l}catch(e){const t=e;throw i.set(o,(e=>({error:t,data:e?.data,previousData:e?.previousData,status:s.FAILURE}))),e}}),[a,o,i]),f=(0,n.useCallback)((()=>{i.set(o,(e=>({previousData:e?.data,status:s.IDLE})))}),[o,i]);return[(0,n.useCallback)(((t,r,o,a)=>{const{data:n,previousData:i,status:u,error:l,promise:d}=c;switch(u){case s.IDLE:return"function"==typeof r?r(i):r;case s.COMPLETED:return"function"==typeof t?t(n??e.default,i):t||null;case s.FAILURE:if(void 0===typeof a&&l instanceof Error)throw l;if(void 0===l)throw new Error("The `ProcessError` is undefined");return"function"==typeof a?a(l,i):a||null;case s.IN_PROGRESS:default:return"function"==typeof o?o(d,i):o}}),[c,e.default]),l,f,c]}})(),a})()));