let currentObserver = null;
const observerToObservableMap = new Map();

const scheduleMicrotask = (callback) => {
  const scheduled = () => {
    queueMicrotask(callback);
  };

  return scheduled;
};

export const observe = (componentId, fn) => {
  currentObserver = { componentId, fn: scheduleMicrotask(fn) };
  try {
    fn();
  } finally {
    // 실행을 보장
    currentObserver = null;
  }

  return () => {
    const records = observerToObservableMap.get(componentId);
    if (records) {
      // 컴포넌트 아이디별 스토어, 사용중인 값 제거
      for (const [observable, name] of records) {
        if (observable?._observerMaps?.[name]) {
          const nameObservers = observable._observerMaps[name];
          nameObservers.forEach((item) => {
            if (item.componentId === componentId) {
              nameObservers.delete(item);
            }
          });
        }
      }
      observerToObservableMap.delete(componentId);
    }
  };
};

/**
 * 얕은 비교를 통해 값 변경을 감지하고 관찰하는 함수를 호출합니다.
 */
export const observable = (obj) => {
  const observerMap = {};

  const proxy = new Proxy(obj, {
    get(target, name) {
      observerMap[name] ??= new Set();

      if (currentObserver) {
        // 키에 해당하는 값 변경시 호출할 함수 저장
        const { componentId, fn } = currentObserver;
        observerMap[name].add({ componentId, fn });

        // 컴포넌트 아이디별 스토어, 사용중인 값 저장
        let records = observerToObservableMap.get(componentId);
        if (!records) {
          records = new Set();
          observerToObservableMap.set(componentId, records);
        }
        records.add([proxy, name]);
      }

      return target[name];
    },
    set(target, name, value) {
      const prev = target[name];
      const next = value;

      if (prev === next) {
        return true;
      }

      target[name] = value;

      // 변경된 값을 관찰하는 함수 호출
      observerMap[name]?.forEach(({ fn }) => fn());
      return true;
    },
  });

  proxy._observerMaps = observerMap;

  return proxy;
};
