// 페이지 모듈: HTML 문자열을 반환하는 render와 선택적인 mount 훅으로 구성됩니다.
export interface PageModule {
  render: (pathParams?: Record<string, string>, queryParams?: Record<string, string>) => string;
  mount?: (root: HTMLElement) => void | (() => void);
}

let routes: Array<{ pattern: string; page: PageModule }> = [];
let cleanup: (() => void) | undefined;

function matchRoute(pattern: string, pathname: string) {
  const patternParts = pattern.split("/");
  const pathParts = pathname.split("/");

  if (patternParts.length !== pathParts.length) return null;

  const params: Record<string, string> = {};

  for (let i = 0; i < patternParts.length; i++) {
    const patternPart = patternParts[i];
    const pathPart = pathParts[i];

    if (patternPart.startsWith(":")) {
      params[patternPart.slice(1)] = pathPart;
    } else if (patternPart !== pathPart) {
      return null;
    }
  }

  return params;
}

function render(urlStr: string) {
  // 리스너 등 이전 페이지 정리
  cleanup?.();
  cleanup = undefined;

  // URL 분해
  const url = new URL(urlStr, location.origin);
  const queryParams = Object.fromEntries(url.searchParams.entries()) as Record<string, string>;

  // 매칭되는 라우트 탐색
  for (const { pattern, page } of routes) {
    const pathParams = matchRoute(pattern, url.pathname);
    if (pathParams) {
      const rootEl = document.getElementById("root")!;

      rootEl.innerHTML = page.render(pathParams, queryParams);

      if (page.mount) {
        const maybeCleanup = page.mount(rootEl);
        if (typeof maybeCleanup === "function") cleanup = maybeCleanup;
      }
      return;
    }
  }

  navigate("/404", true);
}

// local: ''
// deploy: '/front_6th_chapter1-1'
const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

// 배포환경의 경우 /front_6th_chapter1-1을 제거합니다.
function normalize(pathname: string) {
  if (BASE && pathname.startsWith(BASE)) {
    const sliced = pathname.slice(BASE.length);
    return sliced.startsWith("/") ? sliced : "/" + sliced;
  }
  return pathname;
}

function navigate(path: string, replace = false) {
  const url = BASE + path;
  history[replace ? "replaceState" : "pushState"](null, "", url);
  render(path);
}

function initRouter(routeMap: Record<string, PageModule>) {
  routes = Object.entries(routeMap).map(([pattern, page]) => ({ pattern, page }));

  document.addEventListener("click", (e) => {
    // 클릭한 요소의 가장 가까운 data-link 속성을 가진 a태그는 라우팅을 수행(a태그의 기본동작 인터셉트)
    const a = (e.target as HTMLElement).closest("a[data-link]") as HTMLAnchorElement | null;
    if (!a) return;
    e.preventDefault();
    const path = normalize(a.pathname) + a.search;
    navigate(path);
  });

  // 앞으로/뒤로 가기 동작 시에도 SPA처럼 동작하기 위해 렌더 함수를 popstate에 등록
  window.addEventListener("popstate", () => render(normalize(location.pathname) + location.search));

  // 최초 페이지 유입 시 페이지를 그려줌 (쿼리 포함)
  render(normalize(location.pathname) + location.search);
}

export { initRouter, navigate };
