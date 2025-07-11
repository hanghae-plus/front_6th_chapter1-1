import { useObserver } from "./useObserver.js";

export function useState(initialState) {
  let state = { ...initialState };
  const observer = useObserver();

  const subscribe = (callback) => {
    observer.subscribe(callback);
    return () => observer.unsubscribe(callback);
  };

  const setState = (newState) => {
    const prevState = { ...state };

    if (typeof newState === "function") {
      state = { ...state, ...newState(prevState) };
    } else {
      state = { ...state, ...newState };
    }

    observer.notify(state, prevState);
  };

  const getState = () => ({ ...state });

  return {
    subscribe,
    setState,
    getState,
  };
}
