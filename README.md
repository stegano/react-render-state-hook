# React Render State Hook
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-) <!-- ALL-CONTRIBUTORS-BADGE:END --> ![NPM License](https://img.shields.io/npm/l/react-render-state-hook) ![NPM Downloads](https://img.shields.io/npm/dw/react-render-state-hook)

React Render State Hook: This hook allows you to declaratively define components that will be rendered based on the data processing state.

## Installation

The easiest way to install [`react-render-state-hook`](https://www.npmjs.com/package/react-render-state-hook) is with [npm](https://www.npmjs.com/).

```bash
npm install react-render-state-hook
```

Alternately, download the source.

```bash
git clone https://github.com/stegano/react-render-state-hook.git
```

## Quick Start

### Basic 
The `useRenderState` hook enables a declarative approach to display components based on data processing status. 

```tsx
import { useCallback, useEffect } from 'react';
import { useRenderState } from 'react-render-state-hook';

export const App = () => {
  const [render, handleData] = useRenderState<string, Error>();

  useEffect(() => {
    handleData(async () => {
      return 'Hello World';
    });
  }, [handleData]);

  return render(
    (data) => <div>Completed({data})</div>,
    <p>Idle</p>,
    <p>Loading..</p>,
    (error) => <p>Error, Oops something went wrong.. :(, ({error.message})</p>
  );
};
```
Demo: https://stackblitz.com/edit/stackblitz-starters-uv8yjs

### Share Rendering Data 
Without state management libraries like Redux, it is possible to share data and rendering state among multiple containers(components).

```tsx
import { useCallback, useEffect } from 'react';
import { useRenderState } from 'react-render-state-hook';

const shareKey = 'shareKey';

export const ComponentA = () => {
  const [render, handleData] = useRenderState<string, Error>(
    undefined,
    shareKey
  );

  useEffect(() => {
    handleData(async () => {
      return 'Hello World';
    });
  }, [handleData]);

  return render(
    (data) => <div>Completed({data})</div>,
    <p>Idle</p>,
    <p>Loading..</p>,
    (error) => <p>Error, Oops something went wrong.. :(, ({error.message})</p>
  );
};

export const ComponentB = () => {
  const [render, handleData] = useRenderState<string, Error>(
    undefined,
    shareKey
  );

  return render(
    (data) => <div>Completed({data})</div>,
    <p>Idle</p>,
    <p>Loading..</p>,
    (error) => <p>Error, Oops something went wrong.. :(, ({error.message})</p>
  );
};

export const App = () => {
  return (
    <>
      <ComponentA />
      <ComponentB />
    </>
  );
};
```
Demo: https://stackblitz.com/edit/stackblitz-starters-gb4yt6


## RenderStateProvider

### Store
Through the store option, you can create and pass an internally used store for state management. Additionally, you can enable debugging settings for the store object to check logs in the browser console or register necessary middlewares.
```ts
import { useEffect } from 'react';
import {
  RenderStateProvider,
  Store,
  useRenderState,
  IRenderState,
} from 'react-render-state-hook';

const customStroe = Store.createStore<IRenderState.DataHandlingState<any, any>>(
  {
    debug: true,
    middlewareList: [
      (id, next, store) => {
        next.data += ` World | ${id} | ${JSON.stringify(store)}`;
        return next;
      },
    ],
  }
);

const Component = () => {
  const [render, handleData] = useRenderState<string>();

  useEffect(() => {
    handleData(() => 'Hello');
  }, [handleData]);

  return render((data) => <p>{data}</p>);
};

export const App = () => {
  return (
    <RenderStateProvider store={customStroe}>
      <Component />
    </RenderStateProvider>
  );
};

```
Demo: https://stackblitz.com/edit/stackblitz-starters-vc1jnu

### DataHandlerExecutorInterceptorList
The `dataHandlerExecutorInterceptorList` can intercept the execution of `dataHandlerExecutor` enabling you to transform it. This can be beneficial for tasks such as adding logs to track data processing or injecting dummy data for use in Storybook and testing environments.

```tsx
import { useCallback, useEffect } from 'react';
import { RenderStateProvider, useRenderState } from 'react-render-state-hook';

// 'greeting' is the executorId. This value serves as an identifier in `dataHandlerExecutorInterceptor` to distinguish tasks.
const greetingId = 'greeting';

const Component = () => {
  const [render, handleData] = useRenderState<string>();

  useEffect(() => {
    handleData(() => 'Hi', greetingId);
  }, [handleData]);

  return render((greeting) => <p>{greeting}</p>);
};

export const App = ({ children }) => {
  return (
    <RenderStateProvider
      dataHandlerExecutorInterceptorList={[
        async (_previousInterceptorResult, dataHandlerExecutor, executorId) => {
          if (executorId === greetingId) {
            // The `dataHandlerExecutor` with an executorId value of 'greeting' is not actually executed instead, this provider returns the value 'Hello'.
            return 'Hello';
          }
          return await dataHandlerExecutor();
        },
      ]}
    >
      <Component />
    </RenderStateProvider>
  );
};

```
Demo: https://stackblitz.com/edit/stackblitz-starters-hfd32h
## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/stegano"><img src="https://avatars.githubusercontent.com/u/11916476?v=4?s=100" width="100px;" alt="Yongwoo Jung"/><br /><sub><b>Yongwoo Jung</b></sub></a><br /><a href="https://github.com/stegano/react-render-state-hook/commits?author=stegano" title="Code">💻</a> <a href="#ideas-stegano" title="Ideas, Planning, & Feedback">🤔</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!