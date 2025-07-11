import { getCategories, getProduct, getProducts } from "./api/productApi.js";
import page from "./page/index.js";
import detail from "./page/innerText/detail.js";
import modal from "./page/innerText/modal.js";
import notFound from "./page/innerText/notFound.js";
import toast from "./page/innerText/toast.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

window.addEventListener("popstate", () => {
  console.log("앞뒤");
  main();
});

window.onscroll = async function () {
  // 스크롤이 거의 끝에 도달했는지 확인
  if (!window.location.pathname.includes("/product")) {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      if (state.hasNext) {
        const params = {
          page: state.page + 1,
          limit: state.limit,
          search: state.search,
          category1: "",
          category2: "",
          sort: state.sort,
        };
        const data = await getProducts(params);

        state.products = [...state.products, ...data.products];
        state.page = data.pagination.page;
        state.hasNext = data.pagination.hasNext;

        render();
      }
    }
  }
};

let state = {
  page: 1,
  product: [],
  total: 0,
  loading: false,
  limit: 0,
  sort: "price_asc",
  search: "",
  hasNext: true,
  categories: [],
  category1: null,
  category2: null,
  cartNumber: 0,
};

let cartState = {
  selectCartItem: [],
  cartList: [],
};

let detailState = {
  product: null,
  loading: false,
  count: 1,
};

function updateUrlParam(key, value) {
  const url = new URL(window.location);
  const params = url.searchParams;

  params.set(key, value);

  url.search = params.toString();
  window.history.pushState({}, "", url);
}

function detailIncreaseCartQuantity() {
  detailState.count = detailState.count + 1;
  detailRender();
}

function detailDecreaseCartQuantity() {
  detailState.count = detailState.count - 1;
  detailRender();
}

function CartAllDelete() {
  cartState.selectCartItem = [];
  cartState.cartList = [];

  // 기존 모달을 제거
  const existingModal = document.querySelector(".cart-modal");
  if (existingModal) {
    existingModal.remove();
  }
  // 모달을 다시 렌더링
  cartRender();
}

function selectAllCart(checked) {
  console.log("전체 체크");
  // cartState.cartList의 모든 productId를 selectCartItem에 넣어줌

  if (checked) {
    cartState.selectCartItem = cartState.cartList.map((cart) => String(cart.productId));
  } else {
    cartState.selectCartItem = [];
  }
  // 기존 모달을 제거
  const existingModal = document.querySelector(".cart-modal");
  if (existingModal) {
    existingModal.remove();
  }
  // 모달을 다시 렌더링
  cartRender();
}

function selectCartDelete() {
  // cartState.cartList에서 productId가 selectCartItem에 포함된 항목만 제거
  cartState.cartList = cartState.cartList.filter((cart) => !cartState.selectCartItem.includes(String(cart.productId)));
  // 선택된 항목 배열도 비워줌
  cartState.selectCartItem = [];

  // 기존 모달을 제거
  const existingModal = document.querySelector(".cart-modal");
  existingModal.remove();
  // 모달을 다시 렌더링
  cartRender();
}

function selectCart(productId) {
  if (cartState.selectCartItem.includes(String(productId))) {
    cartState.selectCartItem = cartState.selectCartItem.filter((id) => id !== String(productId));
  } else {
    cartState.selectCartItem = [...cartState.selectCartItem, productId];
  }

  // 기존 모달을 제거
  const existingModal = document.querySelector(".cart-modal");
  existingModal.remove();
  // 모달을 다시 렌더링
  cartRender();
}

function deleteCart(productId) {
  // cartState.cartList에서 productId가 같은 요소를 제거
  cartState.cartList = cartState.cartList.filter((cart) => String(cart.productId) !== String(productId));
  console.log("?dsaf", cartState.cartList);
  // 기존 모달을 제거
  state.cartNumber = cartState.cartList.length;

  render();
  const existingModal = document.querySelector(".cart-modal");
  existingModal.remove();
  // 모달을 다시 렌더링
  cartRender();
}

function increaseCartQuantity(productId) {
  console.log("수량 증가", productId);
  // cartState.cartList 안에 있는 요소의 값을 업데이트

  cartState.cartList = cartState.cartList.map((cart) => {
    if (String(cart.productId) === String(productId)) {
      return { ...cart, quantity: cart.quantity + 1 };
    }
    return cart;
  });

  const input = document.querySelector(`.quantity-input[data-product-id="${productId}"]`);
  const updatedItem = cartState.cartList.find((item) => String(item.productId) === String(productId));

  if (input && updatedItem) {
    input.value = updatedItem.quantity;
  }

  const priceElement = document.querySelector(".text-xl.font-bold.text-blue-600");
  if (priceElement) {
    // 장바구니 전체 금액 계산
    const totalPrice = cartState.cartList
      .reduce((sum, cart) => sum + Number(cart.lprice.replace(/[^0-9]/g, "")) * cart.quantity, 0)
      .toLocaleString("ko-KR");
    priceElement.textContent = `${totalPrice}원`;
  }
}

function decreaseCartQuantity(productId) {
  console.log("수량 감소", productId);
  cartState.cartList = cartState.cartList.map((cart) => {
    if (String(cart.productId) === String(productId)) {
      // 수량이 1보다 크면 감소, 아니면 그대로 둠
      return { ...cart, quantity: cart.quantity > 1 ? cart.quantity - 1 : 1 };
    }
    return cart;
  });

  const input = document.querySelector(`.quantity-input[data-product-id="${productId}"]`);
  const updatedItem = cartState.cartList.find((item) => String(item.productId) === String(productId));

  if (input && updatedItem) {
    input.value = updatedItem.quantity;
  }

  const priceElement = document.querySelector(".text-xl.font-bold.text-blue-600");
  if (priceElement) {
    // 장바구니 전체 금액 계산
    const totalPrice = cartState.cartList
      .reduce((sum, cart) => sum + Number(cart.lprice.replace(/[^0-9]/g, "")) * cart.quantity, 0)
      .toLocaleString("ko-KR");
    priceElement.textContent = `${totalPrice}원`;
  }
}

function AddCart(productId) {
  const product = state.products.find(
    (p) => String(p.productId) === String(productId) || String(p.id) === String(productId),
  );
  if (!cartState.cartList.some((item) => String(item.productId) === String(product.productId))) {
    state.cartNumber = cartState.cartList.length + 1;
    const cartItem = {
      productId: product.productId,
      image: product.image,
      title: product.title,
      lprice: product.lprice,
      quantity: 1,
    };
    cartState.cartList = [...cartState.cartList, cartItem];
  } else {
    cartState.cartList = cartState.cartList.map((item) =>
      String(item.productId) === String(product.productId) ? { ...item, quantity: item.quantity + 1 } : item,
    );
  }

  render();
}

async function ReturnCategoryAll() {
  const params = {
    page: 1,
    limit: state.limit,
    search: "",
    category1: "",
    category2: "",
    sort: state.sort,
  };
  const data = await getProducts(params);
  state.products = data.products;
  state.total = data.pagination.total;
  state.limit = data.pagination.limit;
  state.category1 = null;
  state.category2 = null;
  render();
}

async function SelectCategory2(value) {
  console.log("선택 카테고리2", value);
  const params = {
    page: 1,
    limit: state.limit,
    search: "",
    category1: state.category1,
    category2: value,
    sort: state.sort,
  };
  const data = await getProducts(params);
  state.products = data.products;
  state.total = data.pagination.total;
  state.limit = data.pagination.limit;
  state.category2 = value;
  render();
}

async function SelectCategory1(value) {
  console.log("선택 카테고리1", value);
  const params = {
    page: 1,
    limit: state.limit,
    search: "",
    category1: value,
    category2: "",
    sort: state.sort,
  };
  const data = await getProducts(params);
  state.products = data.products;
  state.total = data.pagination.total;
  state.limit = data.pagination.limit;
  state.category1 = value;
  render();
}

//상품 검색 함수
async function SearchProduct(value) {
  console.log("검색 값", value);
  const params = {
    page: 1,
    limit: state.limit,
    search: value,
    category1: "",
    category2: "",
    sort: state.sort,
  };
  const data = await getProducts(params);
  console.log(data);
  state.products = data.products;
  state.total = data.pagination.total;
  state.limit = data.pagination.limit;
  state.hasNext = data.pagination.hasNext;
  state.search = value;
  // URL에 /search=value 추가

  updateUrlParam("search", value);
  render();
}

//개수 변경 함수
async function selectNumber(value) {
  const params = {
    page: 1,
    limit: value,
    search: "",
    category1: "",
    category2: "",
    sort: "price_asc",
  };
  const data = await getProducts(params);

  state.products = data.products;
  state.total = data.pagination.total;
  state.loading = true;
  state.limit = data.pagination.limit;
  console.log(data);
  updateUrlParam("limit", value);
  render();
}

//정렬 변경 함수
async function selectSort(value) {
  console.log("정렬", value);
  const params = {
    page: 1,
    limit: state.limit,
    search: "",
    category1: "",
    category2: "",
    sort: value,
  };
  const data = await getProducts(params);
  console.log(data);
  state.products = data.products;
  state.total = data.pagination.total;
  state.limit = data.pagination.limit;
  state.loading = true;
  state.sort = data.filters.sort;
  updateUrlParam("sort", value);

  render();
}

function notFoundRender() {
  document.body.querySelector("#root").innerHTML = notFound();
}

function cartRender() {
  document.body.insertAdjacentHTML("beforeend", modal(cartState));
  const priceElement = document.querySelector(".text-xl.font-bold.text-blue-600");
  if (priceElement) {
    // 장바구니 전체 금액 계산
    const totalPrice = cartState.cartList
      .reduce((sum, cart) => sum + Number(cart.lprice.replace(/[^0-9]/g, "")) * cart.quantity, 0)
      .toLocaleString("ko-KR");
    priceElement.textContent = `${totalPrice}원`;
  }
  //장바구니 모달 닫기
  document.getElementById("cart-modal-close-btn").addEventListener("click", () => {
    document.querySelector(".cart-modal").remove();
  });

  //장바구니 수량 증가
  document.querySelectorAll(".quantity-increase-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn) {
        const productId = btn.getAttribute("data-product-id");
        increaseCartQuantity(productId);
      }
    });
  });

  //장바구니 수량 감소
  document.querySelectorAll(".quantity-decrease-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn) {
        const productId = btn.getAttribute("data-product-id");
        decreaseCartQuantity(productId);
      }
    });
  });

  //장바구니 삭제
  document.querySelectorAll(".cart-item-remove-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn) {
        const productId = btn.getAttribute("data-product-id");
        deleteCart(productId);
      }
    });
  });

  //상품 전체 체크
  // id가 cart-modal-select-all-checkbox인 체크박스 클릭 이벤트
  // 전체 선택 체크박스 클릭 이벤트
  document.getElementById("cart-modal-select-all-checkbox").addEventListener("change", (e) => {
    // 체크박스가 체크된 상태라면 전체 해제, 아니면 전체 선택
    selectAllCart(e.target.checked);
  });

  //장바구니 아이템 체크
  document.querySelectorAll(".cart-item-checkbox").forEach((checkbox) => {
    checkbox.addEventListener("click", () => {
      const productId = checkbox.getAttribute("data-product-id");
      selectCart(productId);
    });
  });

  //선택한 상품 삭제
  document.getElementById("cart-modal-remove-selected-btn").addEventListener("click", () => {
    selectCartDelete();
  });

  document.getElementById("cart-modal-clear-cart-btn").addEventListener("click", () => {
    CartAllDelete();
  });
}

async function detailRender() {
  document.body.querySelector("#root").innerHTML = detail(detailState, state);

  //상품 상세 카운트 증가
  document.querySelector("#quantity-increase").addEventListener("click", () => {
    detailIncreaseCartQuantity();
  });

  //상품 상세 카운트 감소
  document.querySelector("#quantity-decrease").addEventListener("click", () => {
    detailDecreaseCartQuantity();
  });

  //관련 상품 상세 페이지 이동
  document.querySelectorAll(".aspect-square").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const productId = btn.getAttribute("data-product-id");
      console.log("상세페이지 이동", productId);
      window.history.pushState({}, "", `/product/${productId}`);
      main();
    });
  });
}

async function render() {
  document.body.querySelector("#root").innerHTML = page(state);

  //개수 클릭 시 함수
  const limitSelect = document.getElementById("limit-select");
  // 현재 state.limit 값에 맞게 selected 처리
  Array.from(limitSelect.options).forEach((option) => {
    option.selected = Number(option.value) === Number(state.limit);
  });

  limitSelect.addEventListener("change", (e) => {
    selectNumber(e.target.value);
  });

  const sortSelect = document.getElementById("sort-select");
  // 현재 state.limit 값에 맞게 selected 처리
  Array.from(sortSelect.options).forEach((option) => {
    option.selected = option.value === state.sort;
  });

  sortSelect.addEventListener("change", (e) => {
    selectSort(e.target.value);
  });

  // 검색 입력창에서 엔터키 입력 시 검색 실행
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("keydown", async (e) => {
      if (e.key === "Enter") {
        SearchProduct(e.target.value);
      }
    });
  }

  // 1depth 카테고리 버튼 클릭 시 함수
  document.querySelectorAll(".category1-filter-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      SelectCategory1(btn.getAttribute("data-category1"));
    });
  });

  // 2depth 카테고리 버튼 클릭 시 함수
  document.querySelectorAll(".category2-filter-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      SelectCategory2(btn.getAttribute("data-category2"));
    });
  });

  // data-breadcrumb="reset" 버튼 눌렀을 때 함수
  document.querySelectorAll('[data-breadcrumb="reset"]').forEach((btn) => {
    btn.addEventListener("click", async () => {
      ReturnCategoryAll();
    });
  });

  //장바구니 추가
  document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn) {
        const productId = btn.getAttribute("data-product-id");
        AddCart(productId);
        document.body.insertAdjacentHTML("beforeend", toast());
        setTimeout(() => {
          const toastEl = document.querySelector(".cart-toast");
          if (toastEl) {
            toastEl.remove();
          }
        }, 1000);
      }
    });
  });

  //장바구니 모달 호출
  document.getElementById("cart-icon-btn").addEventListener("click", () => {
    cartRender();
  });

  // 배경(오버레이) 클릭 시 모달 닫기
  document.body.addEventListener("click", function (e) {
    const overlay = document.querySelector(".cart-modal");
    if (overlay && e.target === overlay) {
      overlay.remove();
    }
  });

  // ESC 키로 모달 닫기
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      const overlay = document.querySelector(".cart-modal");
      if (overlay) {
        overlay.remove();
      }
    }
  });
  document.querySelectorAll(".aspect-square").forEach((btn) => {
    btn.addEventListener("click", async () => {
      console.log("상세페이지 이동");
      const productId = btn.getAttribute("data-product-id");
      window.history.pushState({}, "", `/product/${productId}`);
      main();
    });
  });
}

async function main() {
  if (window.location.pathname == "/") {
    render();
    const params = {
      page: 1,
      limit: new URL(window.location).searchParams.get("limit") || state.limit,
      search: new URL(window.location).searchParams.get("search") || state.search,
      category1: state.category1,
      category2: state.category2,
      sort: new URL(window.location).searchParams.get("sort") || state.sort,
    };
    const data = await getProducts(params);

    const categoryData = await getCategories();

    state.products = data.products;
    state.total = data.pagination.total;
    state.loading = true;
    state.limit = new URL(window.location).searchParams.get("limit") || state.limit;
    state.hasNext = data.pagination.hasNext;
    state.search = new URL(window.location).searchParams.get("search") || state.search;
    state.sort = new URL(window.location).searchParams.get("sort") || state.sort;

    state.categories = Object.entries(categoryData).map(([parentKey, children]) => ({
      category: parentKey,
      list: Object.keys(children).map((childKey) => ({ category: childKey })),
    }));

    render();
  } else if (window.location.pathname.includes("/product")) {
    detailRender();
    // url에서 /product/id 형태의 id 값 추출
    const pathParts = window.location.pathname.split("/");
    const productId = pathParts[pathParts.indexOf("product") + 1];
    const data = await getProduct(productId);
    console.log("상품 상세 정보", data);
    detailState.product = data;
    detailState.loading = true;

    detailRender();
  } else {
    notFoundRender();
  }
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
