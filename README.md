# React Render State Hook
![NPM License](https://img.shields.io/npm/l/react-render-state-hook)
![NPM Downloads](https://img.shields.io/npm/dw/react-render-state-hook)

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
import { useState, useCallback } from "react";
import { useRenderState } from "react-render-state-hook";

export const App = () => {
  const [render, handleData] = useRenderState<string, Error>();

  // When this function is invoked, it generates and returns a random string after 3 seconds.
  const updateRandomString = useCallback(
    () =>
      new Promise<string>((resolve) => {
        const randomString = Math.random().toString(32).slice(2);
        setTimeout(() => resolve(randomString), 1000 * 3);
      }),
    [],
  );

  useEffect(() => {
    // When the component is first rendered, it updates a random string.
    handleData(async () => updateRandomString());
  }, [updateRandomString, handleData]);

  const handleButtonClick = useCallback(() => {
    // When the button is clicked, it updates a random string.
    handleData(async () => updateRandomString());
  }, [updateRandomString, handleData]);

  // Use `render` function to define rendering for data processing statuses: succeeded, in-progress, or failed. It auto-renders based on the `handleData` function's processing status.
  return render(
    (data) => (
      <div>
        <p>Succeeded({data})</p>
        <button type="button" onClick={handleButtonClick}>
          Update
        </button>
      </div>
    ),
    <p>Loading..</p>,
    (error) => <p>Error, Oops something went wrong.. :(, ({error.message})</p>,
  );
};
```
Demo: https://stackblitz.com/edit/stackblitz-starters-pgefl6

### Sharing Rendering Data 
It is possible to share data and rendering state among multiple containers(components).

```tsx
import { useState, useCallback } from "react";
import { useRenderState } from "react-render-state-hook";

export const ComponentA = () => {
  const [render, handleData] = useRenderState<string, Error>(
    undefined, 
    "randomString" // By providing a data sharing key, you can share data processing state and values.
  );
  
  const updateRandomString = useCallback(
    () =>
      new Promise<string>((resolve) => {
        const randomString = Math.random().toString(32).slice(2);
        setTimeout(() => resolve(randomString), 1000 * 3);
      }),
    [],
  );

  useEffect(() => {
    handleData(async () => updateRandomString());
  }, [updateRandomString, handleData]);

  return render(
    (data) => (
      <div>
        <p>Succeeded({data})</p>
      </div>
    ),
    <p>Loading..</p>,
    (error) => <p>Error, Oops something went wrong.. :(, ({error.message})</p>,
  );
};

export const ComponentB = () => {
  const [render] = useRenderState<string, Error>(
    undefined, 
    "randomString" // By providing a data sharing key, you can share data processing state and values.
  );

  // While this component does not directly handle the data, the rendering data state is updated by ComponentA.
  return render(
    (data) => (
      <div>
        <p>Succeeded({data})</p>
      </div>
    ),
    <p>Loading..</p>,
    (error) => <p>Error, Oops something went wrong.. :(, ({error.message})</p>,
  );
};

export const App = () => {
  return (
    <>
      <ComponentA />
      <ComponentB />
    </>
  )
};
```


## 🧐 Advanced features

### dataHandlerExecutorInterceptors
`dataHandlerExecutorInterceptors` can intercept `dataHandlerExecutor` execution, allowing you to transform it. It can be useful for adding logs for data processing or injecting dummy data for use in Storybook and testing environments.

```tsx
import { useCallback, useEffect } from 'react';
import {
  RenderStateProvider,
  useRenderState,
} from 'react-render-state-hook';

const Component = () => {
  const generateGreetingMessage = useCallback(async () => {
    // e.g., asynchronous processing tasks like `return (await axios.get('.../data.json')).data.greeting;` are also possible.
    return 'Hi';
  }, []);

  const [render, handleData] = useRenderState<string>();

  useEffect(() => {
    handleData(async () => {
        const greeting = await generateGreetingMessage();
        return greeting;
      }, 
      'greeting' // 'greeting' is the executorId. This value serves as an identifier in `dataHandlerExecutorInterceptors` to distinguish tasks.
    );
  }, [handleData]);

  return render((greeting) => <p>{greeting}</p>);
};

export const App = ({ children }) => {
  return (
    <RenderStateProvider
      dataHandlerExecutorInterceptors={[
        async (_previousInterceptorResult, dataHandlerExecutor, executorId) => {
          if (executorId === 'greeting') {
            // The `dataHandlerExecutor` with an executorId value of 'greeting' is not actually executed instead, this provider returns the value 'Hello'.
            return 'Hello';
          }
          return await dataHandlerExecutor();
        }
      ]}
    >
      <Component />
    </RenderStateProvider>
  );
};
```
Demo: https://stackblitz.com/edit/stackblitz-starters-4qxzui