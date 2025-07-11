export const useObserver = () => {
  const observers = new Set();

  const subscribe = (callback) => {
    observers.add(callback);
  };

  const unsubscribe = (callback) => {
    observers.delete(callback);
  };

  const notify = (...args) => {
    observers.forEach((callback) => callback(...args));
  };

  return { subscribe, unsubscribe, notify };
};
