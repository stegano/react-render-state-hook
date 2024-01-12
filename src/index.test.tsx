/* eslint-disable no-underscore-dangle */
import ReactTestRender from "react-test-renderer";
import { useCallback, useEffect } from "react";
import { useRenderState } from "./hooks";
import { RenderStateProvider } from "./providers";
import { createStore } from "./store/store";
import { defaultStore } from "./providers/render-state";

const delay = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

describe("`useRenderState` Testing", () => {
  beforeEach(async () => {
    defaultStore._reset();
  });

  it("renderSuccess", async () => {
    const TestComponent = () => {
      const task = useCallback(
        async () =>
          new Promise((resolve) => {
            setTimeout(resolve, 100);
          }),
        [],
      );

      const [render, handleData] = useRenderState<string>();

      useEffect(() => {
        handleData(async () => {
          await task();
          return "Aaa";
        });
      }, [handleData, task]);
      return render((data) => <p>Success({data})</p>, <p>Idle</p>, <p>Loading</p>, <p>Error</p>);
    };
    const component = ReactTestRender.create(<TestComponent />);
    await ReactTestRender.act(async () => {
      const state1 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(state1.children?.join("")).toEqual("Idle");
      await delay(1);
      const state2 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(state2.children?.join("")).toEqual("Loading");
      await delay(100 * 2);
      const state3 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(state3.children?.join("")).toEqual("Success(Aaa)");
      component.unmount();
    });
  });

  it("renderError", async () => {
    const TestComponent = () => {
      const asyncErrorTask = useCallback(
        async () =>
          new Promise((_, reject) => {
            setTimeout(() => reject(new Error("Err")), 100);
          }),
        [],
      );
      const [render, handleData] = useRenderState<string, Error>();
      useEffect(() => {
        handleData(async () => {
          await asyncErrorTask();
          return "Aaa";
        }).catch(() => {});
      }, [asyncErrorTask, handleData]);
      return render(
        (data) => <p>Success({data})</p>,
        <p>Idle</p>,
        <p>Loading</p>,
        (e) => <p>Error({e.message})</p>,
      );
    };
    const component = ReactTestRender.create(<TestComponent />);
    await ReactTestRender.act(async () => {
      const state1 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(state1.children?.join("")).toEqual("Idle");
      await delay(100 * 2);
      const state2 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(state2.children?.join("")).toEqual("Error(Err)");
      component.unmount();
      component.unmount();
    });
  });

  it("renderSuccess(with defaultData)", async () => {
    const TestComponent = () => {
      const task = useCallback(
        async () =>
          new Promise((resolve) => {
            setTimeout(resolve, 100);
          }),
        [],
      );
      const [render, handleData] = useRenderState<string>({
        default: "DefaultData",
      });
      useEffect(() => {
        handleData(async () => {
          await task();
          return "Aaa";
        });
      }, [handleData, task]);
      return render((data) => <p>Success({data})</p>, <p>Idle</p>, <p>Loading</p>, <p>Error</p>);
    };
    const component = ReactTestRender.create(<TestComponent />);
    await ReactTestRender.act(async () => {
      const state1 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(state1.children?.join("")).toEqual("Success(DefaultData)");
      await delay(100 * 2);
      const state2 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(state2.children?.join("")).toEqual("Success(Aaa)");
      component.unmount();
    });
  });

  it("renderSuccess(single taskRunnerInterceptor)", async () => {
    const TestComponent = () => {
      const task = useCallback(
        async () =>
          new Promise((resolve) => {
            setTimeout(resolve, 100);
          }),
        [],
      );
      const [render, handleData] = useRenderState<string>();
      useEffect(() => {
        handleData(async () => {
          await task();
          return "Aaa";
        });
      }, [handleData, task]);
      return render((data) => <p>Success({data})</p>, <p>Idle</p>, <p>Loading</p>, <p>Error</p>);
    };
    const component = ReactTestRender.create(
      <RenderStateProvider
        dataHandlerExecutorInterceptorList={[
          async () => {
            return "Bbb";
          },
        ]}
      >
        <TestComponent />
      </RenderStateProvider>,
    );
    await ReactTestRender.act(async () => {
      const state1 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(state1.children?.join("")).toEqual("Idle");
      await delay(100 * 2);
      const state2 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(state2.children?.join("")).toEqual("Success(Bbb)");
      component.unmount();
    });
  });
  it("renderSuccess(single taskRunnerInterceptor with re-load data)", async () => {
    const TestComponent = () => {
      const task = useCallback(
        async () =>
          new Promise((resolve) => {
            setTimeout(resolve, 100);
          }),
        [],
      );
      const [render, handleData] = useRenderState<string>();
      useEffect(() => {
        handleData(async () => {
          await task();
          return "Aaa";
        });
      }, [handleData, task]);
      return render(
        (data) => (
          <button
            type="button"
            onClick={() => {
              handleData(async () => {
                await task();
                return "Reloaded";
              });
            }}
          >
            Success({data})
          </button>
        ),
        <p>Idle</p>,
        <p>Loading</p>,
        <p>Error</p>,
      );
    };
    const component = ReactTestRender.create(
      <RenderStateProvider
        dataHandlerExecutorInterceptorList={[
          async () => {
            await delay(100);
            return "Bbb";
          },
        ]}
      >
        <TestComponent />
      </RenderStateProvider>,
    );
    await ReactTestRender.act(async () => {
      const state1 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(state1.children?.join("")).toEqual("Idle");
      await delay(100 * 2);
      const state2 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(state2.children?.join("")).toEqual("Success(Bbb)");
      await ReactTestRender.act(async () => {
        state2.props.onClick();
      });
      const state3 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(state3.children?.join("")).toEqual("Loading");
      await delay(100 * 2);
      const state4 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(state4.children?.join("")).toEqual("Success(Bbb)");
      component.unmount();
    });
  });
  it("renderSuccess(multiple dataHandlerExecutorInterceptorList)", async () => {
    const TestComponent = () => {
      const task = useCallback(
        async () =>
          new Promise((resolve) => {
            setTimeout(resolve, 100);
          }),
        [],
      );
      const [render, handleData] = useRenderState<string>();
      useEffect(() => {
        handleData(async () => {
          await task();
          return "Aaa";
        });
      }, [handleData, task]);
      return render((data) => <p>Success({data})</p>, <p>Idle</p>, <p>Loading</p>, <p>Error</p>);
    };
    const component = ReactTestRender.create(
      <RenderStateProvider
        dataHandlerExecutorInterceptorList={[
          async () => {
            return "B";
          },
          async (prev) => {
            return `${prev}b`;
          },
          async (prev) => {
            return `${prev}b`;
          },
        ]}
      >
        <TestComponent />
      </RenderStateProvider>,
    );
    await ReactTestRender.act(async () => {
      const state1 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(state1.children?.join("")).toEqual("Idle");
      await ReactTestRender.act(async () => {
        await delay(100 * 2);
        const state2 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
        expect(state2.children?.join("")).toEqual("Success(Bbb)");
      });
      component.unmount();
    });
  });

  it("renderSuccess(dataHandlerExecutorInterceptorList defaultExecutor)", async () => {
    const TestComponent = () => {
      const [render, handleData] = useRenderState<string>({
        default: "test",
      });
      useEffect(() => {
        handleData(async (prev) => {
          return `${prev}/Aaa`;
        });
      }, [handleData]);
      return render((data) => <p>Success({data})</p>, <p>Idle</p>, <p>Loading</p>, <p>Error</p>);
    };

    const component = ReactTestRender.create(
      <RenderStateProvider
        dataHandlerExecutorInterceptorList={[
          async (_prev, dataHandlerExecutor) => {
            return dataHandlerExecutor();
          },
        ]}
      >
        <TestComponent />
      </RenderStateProvider>,
    );

    const state1 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
    await ReactTestRender.act(async () => {
      expect(state1.children?.join("")).toEqual("Success(test)");
      await delay(100 * 2);
      const state2 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(state2.children?.join("")).toEqual("Success(test/Aaa)");
      component.unmount();
    });
  });

  it("Asynchronous `taskRunner` error", async () => {
    const TestComponent = () => {
      const [render, handleData] = useRenderState<string>();
      useEffect(() => {
        handleData(async () => {
          throw new Error("Error");
        }).catch(() => {});
      }, [handleData]);
      return render(<p>Success</p>, <p>Idle</p>, <p>Loading</p>, <p>Error</p>);
    };

    const component = ReactTestRender.create(<TestComponent />);
    await ReactTestRender.act(async () => {
      const state1 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(state1?.children?.join("")).toEqual("Idle");
      await delay(100 * 2);
      const state2 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(state2.children?.join("")).toEqual("Error");
      component.unmount();
    });
  });

  it("renderSuccess(prevData)", async () => {
    const TestComponent = () => {
      const task = useCallback(
        async () =>
          new Promise((resolve) => {
            setTimeout(resolve, 100);
          }),
        [],
      );
      const [render, handleData] = useRenderState<string>();
      useEffect(() => {
        handleData(async () => {
          await task();
          return "Aaa";
        });
      }, [handleData, task]);
      return render(
        (data, prevData) => {
          return (
            <button
              type="button"
              onClick={() => {
                handleData(async () => {
                  await task();
                  return "Bbb";
                });
              }}
            >
              Success({data}
              {prevData ? `, ${prevData}` : ""})
            </button>
          );
        },
        <p>Idle</p>,
        <p>Loading</p>,
        <p>Error</p>,
      );
    };

    const component = ReactTestRender.create(<TestComponent />);
    await ReactTestRender.act(async () => {
      const state1 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(state1.children?.join("")).toEqual("Idle");
      await delay(100 * 2);
      const state2 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(state2.children?.join("")).toEqual("Success(Aaa)");
      state2.props.onClick();
      await delay(100 * 2);
      const state3 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(state3.children?.join("")).toEqual("Success(Bbb, Aaa)");
      component.unmount();
    });
  });

  it("renderSuccess(sync)", async () => {
    const TestComponent = () => {
      const [render, handleData] = useRenderState<string>();
      useEffect(() => {
        handleData(async () => {
          return "Aaa";
        });
      }, [handleData]);
      return render(
        (data, prevData) => {
          return (
            <button
              type="button"
              onClick={() => {
                handleData(() => {
                  return "Bbb";
                });
              }}
            >
              Success({data}
              {prevData ? `, ${prevData}` : ""})
            </button>
          );
        },
        <p>Idle</p>,
        <p>Loading</p>,
        <p>Error</p>,
      );
    };

    const component = ReactTestRender.create(<TestComponent />);
    await ReactTestRender.act(async () => {
      const state1 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(state1.children?.join("")).toEqual("Idle");
      await delay(100 * 2);
      const state2 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(state2.children?.join("")).toEqual("Success(Aaa)");
      await ReactTestRender.act(async () => {
        state2.props.onClick();
      });
      const state3 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(state3.children?.join("")).not.toEqual("Loading");
      component.unmount();
    });
  });

  it("shared data", async () => {
    const TestComponentA = () => {
      const task = useCallback(
        async () =>
          new Promise((resolve) => {
            setTimeout(resolve, 100);
          }),
        [],
      );
      const [render, handleData] = useRenderState<string>(undefined, "share1");
      return render(
        (data, prevData) => {
          return (
            <button
              type="button"
              onClick={() => {
                handleData(async () => {
                  await task();
                  return "Bbb";
                });
              }}
            >
              Success({data}
              {prevData ? `, ${prevData}` : ""})
            </button>
          );
        },
        <button
          type="button"
          onClick={() => {
            handleData(async () => {
              await task();
              return "Aaa";
            });
          }}
        >
          Idle
        </button>,
        <p>Loading</p>,
        <p>Error</p>,
      );
    };
    const TestComponentB = () => {
      const [render] = useRenderState<string>(undefined, "share1");
      return render(
        (data, prevData) => {
          return (
            <button type="button">
              Success({data}
              {prevData ? `, ${prevData}` : ""})
            </button>
          );
        },
        <p>Idle</p>,
        <p>Loading</p>,
        <p>Error</p>,
      );
    };
    const componentA = ReactTestRender.create(<TestComponentA />);
    const componentB = ReactTestRender.create(<TestComponentB />);
    await ReactTestRender.act(async () => {
      const componentAState = componentA.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(componentAState.children?.join("")).toEqual("Idle");
      componentAState.props.onClick();
      await delay(100 * 2);
      const componentAstate2 = componentA.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(componentAstate2.children?.join("")).toEqual("Success(Aaa)");
      componentAstate2.props.onClick();
      await delay(100 * 2);
      const componentAstate3 = componentA.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(componentAstate3.children?.join("")).toEqual("Success(Bbb, Aaa)");
      const componentBstate3 = componentB.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(componentBstate3.children?.join("")).toEqual("Success(Bbb, Aaa)");
      componentA.unmount();
      componentB.unmount();
    });
  });

  it("shared data(after the status processing is updated, create a hook)", async () => {
    const TestComponentA = () => {
      const task = useCallback(
        async () =>
          new Promise((resolve) => {
            setTimeout(resolve, 100);
          }),
        [],
      );
      const [render, handleData] = useRenderState<string>(undefined, "share2");
      useEffect(() => {
        handleData(async () => {
          await task();
          return "Aaa";
        });
      }, [handleData, task]);
      return render(
        (data, prevData) => {
          return (
            <button
              type="button"
              onClick={() => {
                handleData(async () => {
                  await task();
                  return "Bbb";
                });
              }}
            >
              Success({data}
              {prevData ? `, ${prevData}` : ""})
            </button>
          );
        },
        <p>Idle</p>,
        <p>Loading</p>,
        <p>Error</p>,
      );
    };
    const TestComponentB = () => {
      const [render] = useRenderState<string>(undefined, "share2");
      return render(
        (data, prevData) => {
          return (
            <button type="button">
              Success({data}
              {prevData ? `, ${prevData}` : ""})
            </button>
          );
        },
        <p>Idle</p>,
        <p>Loading</p>,
        <p>Error</p>,
      );
    };
    const componentA = ReactTestRender.create(<TestComponentA />);
    await ReactTestRender.act(async () => {
      const componentAState = componentA.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(componentAState.children?.join("")).toEqual("Idle");
      await delay(100 * 2);
      const componentAstate2 = componentA.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(componentAstate2.children?.join("")).toEqual("Success(Aaa)");
      componentAstate2.props.onClick();
      await delay(100 * 2);
      const componentAstate3 = componentA.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(componentAstate3.children?.join("")).toEqual("Success(Bbb, Aaa)");
    });
    const componentB = ReactTestRender.create(<TestComponentB />);
    await ReactTestRender.act(async () => {
      const componentBstate3 = componentB.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(componentBstate3.children?.join("")).toEqual("Success(Bbb, Aaa)");
      componentA.unmount();
      componentB.unmount();
    });
  });

  it("shared error data", async () => {
    const TestComponentA = () => {
      const [render, handleData] = useRenderState<string>(undefined, "share error 1");
      useEffect(() => {
        handleData(async () => {
          return "Aaa";
        });
      }, [handleData]);
      return render(
        (data, prevData) => {
          return (
            <button
              type="button"
              onClick={() => {
                handleData(async () => {
                  throw new Error("Error!");
                }).catch(() => {});
              }}
            >
              Success({data}
              {prevData ? `, ${prevData}` : ""})
            </button>
          );
        },
        <p>Idle</p>,
        <p>Loading</p>,
        <p>Error</p>,
      );
    };
    const TestComponentB = () => {
      const [render] = useRenderState<string>(undefined, "share error 1");
      return render(
        (data, prevData) => {
          return (
            <button type="button">
              Success({data}
              {prevData ? `, ${prevData}` : ""})
            </button>
          );
        },
        <p>Idle</p>,
        <p>Loading</p>,
        <p>Error</p>,
      );
    };

    const componentA = ReactTestRender.create(<TestComponentA />);
    const componentAState = componentA.toJSON() as ReactTestRender.ReactTestRendererJSON;
    expect(componentAState.children?.join("")).toEqual("Idle");
    const componentB = ReactTestRender.create(<TestComponentB />);
    await ReactTestRender.act(async () => {
      await delay(100 * 2);
      const componentAstate2 = componentA.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(componentAstate2.children?.join("")).toEqual("Success(Aaa)");
      componentAstate2.props.onClick();
    });
    await delay(100 * 2);
    await ReactTestRender.act(async () => {
      const componentAstate3 = componentA.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(componentAstate3.children?.join("")).toEqual("Error");
      const componentBstate3 = componentB.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(componentBstate3.children?.join("")).toEqual("Error");
      componentA.unmount();
      componentB.unmount();
    });
  });
  it("shared error data(after the status processing is updated, create a hook)", async () => {
    const TestComponentA = () => {
      const [render, handleData] = useRenderState<string>(undefined, "share error 2");
      useEffect(() => {
        handleData(async () => {
          return "Aaa";
        });
      }, [handleData]);
      return render(
        (data, prevData) => {
          return (
            <button
              type="button"
              onClick={() => {
                handleData(async () => {
                  throw new Error("Error!");
                }).catch(() => {});
              }}
            >
              Success({data}
              {prevData ? `, ${prevData}` : ""})
            </button>
          );
        },
        <p>Idle</p>,
        <p>Loading</p>,
        (e) => <p>{(e as Error).message}</p>,
      );
    };
    const TestComponentB = () => {
      const [render] = useRenderState<string>(undefined, "share error 2");
      return render(<p>Success</p>, <p>Idle</p>, <p>Loading</p>, (e) => (
        <p>{(e as Error).message}</p>
      ));
    };
    const componentA = ReactTestRender.create(<TestComponentA />);
    await ReactTestRender.act(async () => {
      const componentAState = componentA.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(componentAState.children?.join("")).toEqual("Idle");
      await delay(100 * 2);
      const componentAstate2 = componentA.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(componentAstate2.children?.join("")).toEqual("Success(Aaa)");
      componentAstate2.props.onClick();
      await delay(100 * 2);
      const componentAstate3 = componentA.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(componentAstate3.children?.join("")).toEqual("Error!");
    });
    const componentB = ReactTestRender.create(<TestComponentB />);
    await ReactTestRender.act(async () => {
      const componentBstate3 = componentB.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(componentBstate3.children?.join("")).toEqual("Error!");
      componentA.unmount();
      componentB.unmount();
    });
  });

  it("When the `DataResetHandler` function is invoked, assert the state", async () => {
    const TestComponent = () => {
      const [renderData, , handleDataReset] = useRenderState<string>({
        default: "Test",
      });
      return renderData(
        (data) => (
          <button
            type="button"
            onClick={() => {
              handleDataReset();
            }}
          >
            Success({data})
          </button>
        ),
        <p>Idle</p>,
        <p>Loading</p>,
        <p>Error</p>,
      );
    };
    const component = ReactTestRender.create(<TestComponent />);
    await ReactTestRender.act(async () => {
      const state1 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(state1.children?.join("")).toEqual("Success(Test)");
      const state2 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
      state2.props.onClick();
      await delay(1);
      const state3 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(state3.children?.join("")).toEqual("Idle");
      component.unmount();
    });
  });

  it("shared data with custom store", async () => {
    const TestComponentA = () => {
      const task = useCallback(
        async () =>
          new Promise((resolve) => {
            setTimeout(resolve, 100);
          }),
        [],
      );
      const [render, handleData] = useRenderState<string>(undefined, "share1");
      useEffect(() => {
        handleData(async () => {
          await task();
          return "Aaa";
        });
      }, [handleData, task]);
      return render(
        (data, prevData) => {
          return (
            <button
              type="button"
              onClick={() => {
                handleData(async () => {
                  await task();
                  return "Bbb";
                });
              }}
            >
              Success({data}
              {prevData ? `, ${prevData}` : ""})
            </button>
          );
        },
        <p>Idle</p>,
        <p>Loading</p>,
        <p>Error</p>,
      );
    };
    const TestComponentB = () => {
      const [render] = useRenderState<string>(undefined, "share1");
      return render(
        (data, prevData) => {
          return (
            <button type="button">
              Success({data}
              {prevData ? `, ${prevData}` : ""})
            </button>
          );
        },
        <p>Idle</p>,
        <p>Loading</p>,
        <p>Error</p>,
      );
    };

    const customStore = createStore();
    const componentA = ReactTestRender.create(
      <RenderStateProvider store={customStore}>
        <TestComponentA />
      </RenderStateProvider>,
    );
    await ReactTestRender.act(async () => {
      const componentAState = componentA.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(componentAState.children?.join("")).toEqual("Idle");
    });
    const componentB = ReactTestRender.create(
      <RenderStateProvider store={customStore}>
        <TestComponentB />
      </RenderStateProvider>,
    );
    await ReactTestRender.act(async () => {
      await delay(100 * 2);
      const componentAstate2 = componentA.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(componentAstate2.children?.join("")).toEqual("Success(Aaa)");
      await ReactTestRender.act(async () => {
        componentAstate2.props.onClick();
      });
      await delay(100 * 2);
      const componentAstate3 = componentA.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(componentAstate3.children?.join("")).toEqual("Success(Bbb, Aaa)");
      const componentBstate3 = componentB.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(componentBstate3.children?.join("")).toEqual("Success(Bbb, Aaa)");
      expect(customStore.getSnapshot()).toEqual({
        share1: { data: "Bbb", previousData: "Aaa", status: "COMPLETED" },
      });
      componentA.unmount();
      componentB.unmount();
    });
  });
});
