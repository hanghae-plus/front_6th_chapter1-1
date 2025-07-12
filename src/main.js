import { getProducts, getCategories } from "./api/productApi.js";
import { createRouter } from "./router.js"; // 라우터 임포트
import { throttle } from "./utils/throttle.js"; // throttle 함수 임포트
import { setupCommonEventListeners } from "./events/eventHandlers.js"; // 새로 추가된 이벤트 핸들러 임포트

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker, workerOptions }) => worker.start(workerOptions));

if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}

/**
 * 메인 홈페이지 렌더링 및 상태 값
 */
const mainStatus = {
  products: [],
  total: 0,
  loading: true, // 초기 로딩 상태
  params: {
    page: 1,
    limit: 20,
    search: "",
    category1: "",
    category2: "",
    sort: "price_asc",
  },
  categories: {},
  url: "/",
};

// 라우터 인스턴스를 전역적으로 접근 가능하도록 선언
let appRouter;
let isInit = true;

// 무한 스크롤 함수
async function loadMoreProducts() {
  if (mainStatus.loading || mainStatus.products.length >= mainStatus.total) {
    return;
  }
  mainStatus.loading = true;
  mainStatus.params.page += 1; // 페이지 번호 증가
  appRouter.updateStateAndRender(mainStatus); // 로딩 스피너 표시

  try {
    const productsData = await getProducts(mainStatus.params);
    // 기존 상품 목록에 새로운 상품 추가
    mainStatus.products.push(...productsData.products);
    mainStatus.total = productsData.pagination.total;
  } catch (error) {
    console.error("loadMoreProducts", "추가 상품 로딩 중 오류:", error);
  } finally {
    mainStatus.loading = false;
    appRouter.updateStateAndRender(mainStatus); // 최종 상태 반영
  }
}
// 스크롤 이벤트 핸들러
const handleScroll = () => {
  // window.innerHeight: 브라우저 창의 높이
  // window.scrollY: 스크롤된 거리
  // document.body.offsetHeight: 전체 문서의 높이
  // 맨 아래에서 300px 위 지점에 도달했을 때 로드하도록 버퍼를 줍니다.
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
    loadMoreProducts();
  }
};
const throttledScrollHandler = throttle(handleScroll, 200); // 200ms 간격으로 호출 제한

// API 호출 및 렌더링을 담당하는 함수 (export 추가)
export async function loadProductsAndUpdateUI() {
  isInit && (mainStatus.loading = true);

  appRouter.updateStateAndRender(mainStatus); // 로딩 상태 먼저 반영

  try {
    // 카테고리와 제품 목록을 동시에 요청하여 성능 최적화
    const [categories, productsData] = await Promise.all([getCategories(), getProducts(mainStatus.params)]);
    mainStatus.categories = categories;
    mainStatus.products = productsData.products;
    mainStatus.total = productsData.pagination.total;
  } catch (error) {
    console.error("loadProductsAndUpdateUI", "데이터를 불러오는 중 오류가 발생했습니다:", error);
  } finally {
    mainStatus.loading = false;
    isInit = false;
    appRouter.updateStateAndRender(mainStatus); // 최종 상태 반영
  }
}

// 스크롤 이벤트 리스너 추가 함수 (외부에서 호출 가능하도록 export)
export function addScrollListener() {
  window.addEventListener("scroll", throttledScrollHandler);
}

// 스크롤 이벤트 리스너 제거 함수 (외부에서 호출 가능하도록 export)
export function removeScrollListener() {
  window.removeEventListener("scroll", throttledScrollHandler);
}

async function main() {
  // 라우터 초기화: mainStatus 객체를 라우터에 전달하여 라우터가 상태를 관리하도록 함
  if (window.location.search) {
    let array = window.location.search.replace("?", "").split("&");
    for (const element of array) {
      let [k, v] = element.split("=");
      mainStatus.params[k] = isNaN(v) ? decodeURI(v) : Number(v);
    }
  }
  appRouter = createRouter(mainStatus);

  // 초기 데이터 로드 및 UI 업데이트
  await loadProductsAndUpdateUI();

  // 기타 이벤트 리스너 설정 (스크롤 제외)
  setupCommonEventListeners(mainStatus, appRouter); // 변경된 부분

  // 초기에는 홈 페이지이므로 스크롤 리스너 추가
  addScrollListener();
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
