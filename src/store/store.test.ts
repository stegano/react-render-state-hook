import { createStore } from "./store";

describe("store", () => {
  it("should create the store", () => {
    const store = createStore();
    expect(store).toBeDefined();
  });
  it("should have the correct initial state", () => {
    const store = createStore({
      initialStore: {
        data: ["a", "b", "c"],
      },
    });
    expect(store.getSnapshot()).toEqual({
      data: ["a", "b", "c"],
    });
  });
  it("should update the state", () => {
    const store = createStore({
      initialStore: {
        data: ["a", "b", "c"],
      },
    });
    store.set("data", ["d", "e", "f"]);
    expect(store.getSnapshot()).toEqual({
      data: ["d", "e", "f"],
    });
  });
  it("should subscribe to updates", () => {
    const store = createStore({
      initialStore: {
        data: ["a", "b", "c"],
      },
    });
    const listener = jest.fn();
    store.subscribe(listener);
    store.set("data", ["d", "e", "f"]);
    expect(listener).toHaveBeenCalledTimes(1);
  });
  it("should unsubscribe from updates", () => {
    const store = createStore({
      initialStore: {
        data: ["a", "b", "c"],
      },
    });
    const listener = jest.fn();
    const unsubscribe = store.subscribe(listener);
    unsubscribe();
    store.set("data", ["d", "e", "f"]);
    expect(listener).toHaveBeenCalledTimes(0);
  });
  it("should get the state", () => {
    const store = createStore({
      initialStore: {
        data: ["a", "b", "c"],
      },
    });
    expect(store.get("data")).toEqual(["a", "b", "c"]);
  });
  it("single middleware test", () => {
    const store = createStore({
      middlewareList: [
        (_id, data) => {
          return data.map((item: string) => item.toUpperCase());
        },
      ],
    });
    store.set("data", ["a", "b", "c"]);
    expect(store.getSnapshot()).toEqual({
      data: ["A", "B", "C"],
    });
  });
  it("multiple middleware test", () => {
    const store = createStore({
      middlewareList: [
        (_id, data) => {
          return data.map((item: string) => item.toUpperCase());
        },
        (_id, data) => {
          return data.map((item: string) => item.toLowerCase());
        },
      ],
    });
    store.set("data", ["A", "B", "C"]);
    expect(store.getSnapshot()).toEqual({
      data: ["a", "b", "c"],
    });
  });
});
