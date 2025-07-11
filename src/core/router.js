const BASE_PATH = import.meta.env.PROD ? "/front_6th_chapter1-1" : "";
// const BASE_PATH = "/front_6th_chapter1-1";

class Router {
  #pagesMap = new Map();
  #pageDispose;
  #currentParams;
  #root = "#root";

  addPage(pathname, page) {
    this.#pagesMap.set(this.#ensureBasePath(pathname), page);
    return this;
  }

  init({ _404 = null } = {}) {
    this._404 = _404;
    this.#setEvents();
    const params = this.#getSearchParams();
    this.#navigateTo({ pathname: location.pathname, params });
  }

  push({ pathname = location.pathname, params = {} } = {}) {
    this.#updateUrl({ type: "pushState", pathname, params });
    this.#navigateTo({ pathname, params });
  }

  replace({ pathname = location.pathname, params = {} } = {}) {
    this.#updateUrl({ type: "replaceState", pathname, params });
    this.#navigateTo({ pathname, params });
  }

  updateParams(params) {
    this.#updateUrl({ type: "replaceState", pathname: location.pathname, params });
  }

  getParams() {
    return this.#currentParams;
  }

  #ensureBasePath(pathname) {
    const originPathname = pathname.startsWith(BASE_PATH) ? pathname.replace(BASE_PATH, "") : pathname;
    if (originPathname === "/") return BASE_PATH;
    return BASE_PATH + originPathname;
  }

  #setEvents() {
    window.addEventListener("popstate", () => {
      const params = this.#getSearchParams();
      this.#navigateTo({ pathname: location.pathname, params });
    });
    document.addEventListener("click", (e) => {
      const $link = e.target.closest("[data-link]");
      if ($link) {
        e.preventDefault();
        const { pathname } = new URL($link.href);
        this.push({ pathname });
      }
    });
  }

  #getSearchParams() {
    return Object.fromEntries(new URLSearchParams(location.search));
  }

  #navigateTo({ pathname = location.pathname, params = {} } = {}) {
    pathname = this.#ensureBasePath(pathname);

    if (this.#pageDispose) {
      this.#pageDispose();
    }

    this.#currentParams = params;
    const page = this.#matchPage({ pathname, params });

    if (page) {
      this.#pageDispose = page(this.#root);
    } else {
      this.#pageDispose = this._404(this.#root);
    }
  }

  #matchPage({ pathname = location.pathname, params = {} } = {}) {
    if (this.#pagesMap.has(pathname)) {
      return this.#pagesMap.get(pathname);
    }

    const pathnameSegments = pathname.split("/");
    for (const [pagePathnameSegments, page] of this.#pagesMap.entries()) {
      const pagePathnameParts = pagePathnameSegments.split("/");
      if (pagePathnameParts.length !== pathnameSegments.length) {
        continue;
      }

      let match = true;

      for (let i = 0; i < pagePathnameParts.length; i++) {
        if (pagePathnameParts[i].startsWith(":")) {
          this.#currentParams = { ...this.#currentParams, [pagePathnameParts[i].slice(1)]: pathnameSegments[i] };
          continue;
        }

        if (pagePathnameParts[i] !== pathnameSegments[i]) {
          match = false;
          break;
        }
      }

      if (match) {
        this.#currentParams = { ...this.#currentParams, ...params };
        return page;
      }
    }

    return null;
  }

  #updateUrl({ type = "pushState", pathname = location.pathname.replace(BASE_PATH, ""), params = {} } = {}) {
    pathname = this.#ensureBasePath(pathname);
    const url = new URL(pathname, location.origin);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    window.history[type]({}, "", url);
  }
}

export const router = new Router();
