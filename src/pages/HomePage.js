import { getProducts, getCategories } from "../api/productApi";
import { router } from "../main";
import { Main } from "./Main";

let state = {
  products: [],
  pagination: {},
  filters: {},
  category: {},
  isLoading: false,
};

export const HomePage = async () => {
  const params = new URLSearchParams(window.location.search);
  const limit = params.get("limit");
  const sort = params.get("sort");
  const search = params.get("search");
  const allAarams = { ...(limit ? { limit } : {}), ...(sort ? { sort } : {}), ...(search ? { search } : {}) };

  document.body.querySelector("#root").innerHTML = Main({});

  const [projectData, categoryData] = await Promise.all([getProducts({ ...allAarams }), getCategories()]);

  if (projectData) {
    state.pagination = projectData.pagination;
    state.filters = projectData.filters;
    state.products = projectData.products;
  }

  if (categoryData) {
    state.category = categoryData;
  }

  document.body.querySelector("#root").innerHTML = Main(state);

  bindCardClickHandlers();
  // bindCartClickHandlers();
};

const handleSelect = async function (e, key) {
  e.preventDefault();
  state.isLoading = true;
  document.body.querySelector("#root").innerHTML = Main({ ...state, products: [], isLoading: true });

  const value = e.target.value;
  const [otherKey, otherValue] = key === "limit" ? ["sort", state.filters.sort] : ["limit", state.pagination.limit];

  const params = new URLSearchParams(window.location.search);
  params.set(key, value);
  params.set(otherKey, otherValue);
  // 필요하다면 다른 필터들도 params.set('search', state.filters.search) 처럼 넣어두세요
  // 2) 히스토리 스택에 반영 (새로고침 없이 주소만 변경)
  history.pushState(null, "", `${window.location.pathname}?${params.toString()}`);

  const projectData = await getProducts({
    [key]: key === "limit" ? Number(value) : value,
    [otherKey]: otherValue,
    search: state.filters.search,
    category1: state.filters.category1,
    category2: state.filters.category2,
  });

  if (projectData) {
    state.pagination = projectData.pagination;
    state.filters = projectData.filters;
    state.products = projectData.products;
  }

  state.isLoading = false;

  document.body.querySelector("#root").innerHTML = Main(state);
};

const handleInput = async function (e) {
  e.preventDefault();
  const value = e.target.value;
  state.filters.search = value;
};

const handleChange = function () {
  document.body.querySelector("#root").innerHTML = Main(state);
};

const handleEnter = async function (e) {
  if (e.key !== "Enter") return;

  e.preventDefault();

  const params = new URLSearchParams(window.location.search);
  params.set("search", state.filters.search);
  history.pushState(null, "", `${window.location.pathname}?${params.toString()}`);

  state.isLoading = false;
  const projectData = await getProducts({
    sort: state.filters.sort,
    limit: state.pagination.limit,
    search: state.filters.search,
    page: state.filters.page,
  });

  if (projectData) {
    state.pagination = projectData.pagination;
    state.filters = projectData.filters;
    state.products = projectData.products;
  }

  document.body.querySelector("#root").innerHTML = Main(state);
};

document.addEventListener("change", (e) => {
  if (e.target.matches("#limit-select")) {
    handleSelect(e, "limit");
  }

  if (e.target.matches("#sort-select")) {
    handleSelect(e, "sort");
  }

  if (e.target.matches("#search-input")) {
    handleChange(e);
  }
});

document.addEventListener("input", (e) => {
  if (e.target.matches("#search-input")) {
    handleInput(e);
  }
});

document.addEventListener("keydown", (e) => {
  if (e.target.matches("#search-input")) {
    handleEnter(e);
  }
});

document.addEventListener("click", (e) => {
  if (e.target.matches(".add-to-cart-btn")) {
    handleAddCart(e);
  }
});

const handleAddCart = (e) => {
  const card = e.target.closest(".product-card");
  const projectId = card.dataset.productId;

  if (localStorage.getItem("cart") === null) {
    localStorage.setItem("cart", String(projectId));
    document.body.querySelector("#root").innerHTML = Main(state);
  } else {
    const storedValue = localStorage.getItem("cart");
    if (!storedValue.split(",").includes(projectId)) {
      const numValue = `${storedValue},${projectId}`;
      localStorage.setItem("cart", String(numValue));
      document.body.querySelector("#root").innerHTML = Main(state);
    } else {
      alert("이미 카트에 담겨 있습니다.");
    }
  }
};

function bindCardClickHandlers() {
  const cards = document.querySelectorAll(".product-card");
  cards.forEach((card) => {
    card.onclick = (e) => {
      if (e.target.closest(".add-to-cart-btn")) {
        return;
      }

      const projectId = card.dataset.productId;
      history.pushState({}, "", `/product/${projectId}`);
      router();
    };
  });
}

let lastScrollY = window.scrollY;

window.addEventListener(
  "scroll",
  async () => {
    const [, link] = location.pathname.split("/");

    if (link === "") {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        const docHeight = document.documentElement.scrollHeight;
        const scrollPos = currentScrollY + window.innerHeight;

        if (!state.isLoading && state.pagination.hasNext && scrollPos + 200 >= docHeight) {
          state.isLoading = true;
          document.body.querySelector("#root").innerHTML = Main({ ...state });

          const projectData = await getProducts({
            sort: state.filters.sort,
            limit: state.pagination.limit,
            search: state.filters.search,
            category1: state.filters.category1,
            category2: state.filters.category2,
            page: state.pagination.page + 1,
          });

          if (projectData) {
            state.pagination = projectData.pagination;
            state.filters = projectData.filters;
            state.products = [...state.products, ...projectData.products];
          }

          state.isLoading = false;

          document.body.querySelector("#root").innerHTML = Main(state);
        }
      } else if (currentScrollY < lastScrollY) {
        if (state.isLoading) {
          state.isLoading = false;
        }
      }

      lastScrollY = currentScrollY;
    }
  },
  { passive: true },
);

document.addEventListener("DOMContentLoaded", () => {
  state = {
    products: [],
    pagination: {},
    filters: {},
    category: {},
    isLoading: false,
  };
});
