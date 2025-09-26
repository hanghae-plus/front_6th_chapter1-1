export const withBatch = (fn) => {
  let scheduled = false;

  return (...args) => {
    if (scheduled) return;
    scheduled = true;

    queueMicrotask(() => {
      scheduled = false;
      fn(...args);
    });
  };
};
