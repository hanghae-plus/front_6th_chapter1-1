import Home from "../pages/Home.js";
import ProductDetail from "../pages/ProductDetail.js";
import { NotFound } from "../pages/NotFound.js";

const BASE_PATH = import.meta.env.PROD ? "/front_6th_chapter1-1/" : "/";

const getAppPath = (fullPath = window.location.pathname) => {
  if (BASE_PATH === "/") return fullPath;
  return fullPath.startsWith(BASE_PATH) ? fullPath.slice(BASE_PATH.length - 1) : fullPath;
};

const getFullPath = (appPath) => {
  if (BASE_PATH === "/") return appPath;
  return BASE_PATH.slice(0, -1) + appPath;
};

const routes = [
  {
    path: "/",
    handler: (container, params) => {
      new Home(container, params);
    },
  },
  {
    path: "/product/:id",
    handler: (container, params) => {
      new ProductDetail(container, params);
    },
  },
  {
    path: "*",
    handler: (container) => {
      container.innerHTML = NotFound();
    },
  },
];

export function useRouter(container) {
  const routeMap = {};

  const initRoutes = () => {
    routes.forEach((route) => {
      routeMap[route.path] = route.handler;
    });
  };

  const getQueryParams = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const query = {};

    for (const [key, value] of searchParams) {
      query[key] = value;
    }

    return { query };
  };

  const findRoute = (path) => {
    if (routeMap[path]) {
      return { route: path, params: {} };
    }

    for (const routePath in routeMap) {
      if (routePath.includes(":")) {
        const routeParts = routePath.split("/");
        const pathParts = path.split("/");

        if (routeParts.length === pathParts.length) {
          const params = {};
          let isMatch = true;

          for (let i = 0; i < routeParts.length; i++) {
            if (routeParts[i].startsWith(":")) {
              const paramName = routeParts[i].slice(1);
              params[paramName] = pathParts[i];
            } else if (routeParts[i] !== pathParts[i]) {
              isMatch = false;
              break;
            }
          }

          if (isMatch) {
            return { route: routePath, params };
          }
        }
      }
    }

    return null;
  };

  const render = async (path) => {
    if (!path) {
      path = getAppPath(window.location.pathname);
    } else {
      path = getAppPath(path);
    }

    const result = findRoute(path);

    if (result) {
      const component = routeMap[result.route];
      const { query } = getQueryParams();
      const params = { ...result.params, ...query };
      await component(container, params);
    } else {
      const notFoundHandler = routeMap["*"];
      await notFoundHandler(container);
    }
  };

  const navigate = (path) => {
    const fullPath = getFullPath(path);

    // 현재 URL과 같은 경우 히스토리에 추가하지 않음
    if (window.location.pathname === fullPath) {
      return;
    }

    history.pushState(null, "", fullPath);
    render(path);
  };

  const updateQuery = (key, value, options = {}) => {
    const url = new URL(window.location);
    if (value) {
      url.searchParams.set(key, value);
    } else {
      url.searchParams.delete(key);
    }

    const newUrl = url.pathname + url.search;
    history.pushState(null, "", newUrl);

    if (options.rerender !== false) {
      render();
    }
  };

  let popstateHandler = null;

  const init = () => {
    initRoutes();

    // 기존 이벤트 리스너 제거
    if (popstateHandler) {
      window.removeEventListener("popstate", popstateHandler);
    }

    // 새로운 이벤트 리스너 등록
    popstateHandler = () => {
      render(getAppPath(window.location.pathname));
    };

    window.addEventListener("popstate", popstateHandler);

    render(getAppPath(window.location.pathname));
  };

  return {
    init,
    navigate,
    updateQuery,
    getQueryParams,
    render,
  };
}
