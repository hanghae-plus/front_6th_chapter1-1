import cart from "./@store/cart.js";
import { handleRoute } from "./router/router.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker, workerOptions }) => worker.start(workerOptions));

if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}

window.onpopstate = () => {
  handleRoute();
};

async function main() {
  handleRoute();
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  cart.init();

  enableMocking().then(main);
} else {
  cart.init();

  main();
}
