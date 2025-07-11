import { Header } from "../components/Layout/Header";
import { FilterSection } from "../components/FilterSection/FilterSection";
import { ProductSection } from "../components/ProductSection/ProductSection";
import { Footer } from "../components/Layout/Footer";
import { render } from "../utils/render";
import { createStore } from "../states/product/productStore";
import { getQueryState } from "../states/getQueryState";
import { getProducts, getCategories } from "../api/productApi";
import { isStateChanged } from "../states/isStateChanged";
import { navigate } from "../utils/navigate";
import { updateUrlState } from "../states/updateUrlState";
import { productListState } from "../states/product/productState";
import { getAppPath } from "../router";

let store = null;
let prev = { ...productListState };

function renderHomePage(state, cartCount) {
  render(/* HTML */ `
    <div class="bg-gray-50">
      ${Header({ type: "home", cartCount })}
      <main class="max-w-md mx-auto px-4 py-4">
        ${FilterSection({
          search: state.search,
          categories: state.categories,
          category1: state.category1,
          category2: state.category2,
          isLoading: state.isCategoryLoading,
          limit: state.limit,
          sort: state.sort,
        })}
        ${ProductSection({
          isLoading: state.isLoading,
          products: state.products,
          total: state.total,
          hasNext: state.hasNext,
        })}
      </main>
      ${Footer()}
    </div>
  `);

  addEvents();
}

async function loadProducts({ isInit = false } = {}) {
  const state = isInit ? getQueryState({ resetPage: isInit }) : store.getState();

  store.setState({
    ...(isInit ? state : {}),
    isLoading: true,
    isCategoryLoading: isInit,
  });

  try {
    const [categories, data] = await Promise.all([
      isInit ? getCategories() : Promise.resolve(store.getState().categories),
      getProducts({
        page: state.page,
        limit: parseInt(state.limit),
        search: state.search,
        category1: state.category1,
        category2: state.category2,
        sort: state.sort,
      }),
    ]);

    store.setState({
      ...(isInit ? { categories } : {}),
      products: data.products,
      total: data.pagination.total,
      isLoading: false,
      isCategoryLoading: false,
    });
  } catch (e) {
    console.error(e);
    store.setState({
      isLoading: false,
      isCategoryLoading: false,
    });
  }
}

async function loadMoreProducts() {
  const state = store.getState();
  if (state.loading || !state.hasNext) return;

  const currentProducts = state.products;
  const nextPage = state.page + 1;

  store.setState({
    isLoading: true,
  });

  try {
    const data = await getProducts({
      page: nextPage,
      limit: parseInt(state.limit),
      search: state.search,
      category1: state.category1,
      category2: state.category2,
      sort: state.sort,
    });

    store.setState({
      products: [...currentProducts, ...data.products],
      total: data.pagination.total,
      isLoading: false,
      page: nextPage,
      hasNext: nextPage * parseInt(state.limit) < data.pagination.total,
    });

    updateUrlState(state);
  } catch (e) {
    console.error(e);
    store.setState({
      isLoading: false,
    });
  }
}

export function Home(cartCount) {
  if (!store) {
    store = createStore(productListState);

    store.subscribe((state) => {
      if (getAppPath() === "/") {
        renderHomePage(state, cartCount);
      }
    });

    store.subscribe((state) => {
      if (isStateChanged(prev, state)) {
        updateUrlState(state);
        loadProducts();
      }
      prev = { ...state };
    });

    loadProducts({ isInit: true }).then(() => {
      updateUrlState(store.getState());
    });
  }
}

function addEvents() {
  const state = store.getState();

  const inputItem = document.querySelector("#search-input");
  if (inputItem) {
    inputItem.value = state.search;
    inputItem.onkeypress = (e) => {
      if (e.key === "Enter") {
        store.setState({ search: e.target.value, page: 1 });
      }
    };
  }

  const limitItem = document.querySelector("#limit-select");
  if (limitItem) {
    limitItem.onchange = (e) => {
      store.setState({ limit: e.target.value, page: 1 });
    };
  }

  const sortItem = document.querySelector("#sort-select");
  if (sortItem) {
    sortItem.onchange = (e) => {
      store.setState({ sort: e.target.value, page: 1 });
    };
  }

  document.querySelectorAll("[data-category1]:not([data-category2])").forEach((category) => {
    category.onclick = (e) => {
      store.setState({
        category1: e.target.dataset.category1,
        category2: "",
        page: 1,
      });
    };
  });

  document.querySelectorAll("[data-category2]").forEach((category) => {
    category.onclick = (e) => {
      store.setState({
        category1: e.target.dataset.category1,
        category2: e.target.dataset.category2,
        page: 1,
      });
    };
  });

  const resetBtn = document.querySelector("[data-breadcrumb='reset']");
  if (resetBtn) {
    resetBtn.onclick = () => {
      navigate(getAppPath());

      store.setState({
        category1: "",
        category2: "",
        search: "",
        page: 1,
      });
      if (inputItem) inputItem.value = "";
    };
  }

  const categoryBtn = document.querySelector("[data-breadcrumb='category1']");
  if (categoryBtn) {
    categoryBtn.onclick = (e) => {
      store.setState({
        category1: e.target.dataset.category1,
        category2: "",
        page: 1,
      });
    };
  }

  window.addEventListener("scroll", () => {
    const currentState = store.getState();
    if (currentState.isLoading || !currentState.hasNext) return;

    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      loadMoreProducts();
    }
  });

  window.addEventListener("popstate", () => {
    const queryState = getQueryState();

    store.setState({
      ...queryState,
      page: parseInt(queryState.page) || 1,
    });
  });
}
