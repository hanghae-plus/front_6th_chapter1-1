export const throttle = (callback, delay = 200) => {
  let timeId;
  return (...args) => {
    if (timeId) return;
    timeId = setTimeout(() => {
      callback(...args);
      timeId = null;
    }, delay);
  };
};
