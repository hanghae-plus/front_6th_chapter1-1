import { useRouter } from "../hooks/useRouter.js";

let _router = null;

export const getRouter = () => {
  if (!_router) {
    _router = useRouter(document.getElementById("root"));
  }
  return _router;
};

export const initRouter = () => {
  const router = getRouter();
  router.init();
  return router;
};

export const resetRouter = () => {
  _router = null;
};
