import { initRouter } from "./core/router.js";
import { initCart } from "./core/cart.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker, workerOptions }) => worker.start(workerOptions));

if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}

function main() {
  // 각 도메인별 싱글톤 초기화
  initRouter();
  initCart();
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
