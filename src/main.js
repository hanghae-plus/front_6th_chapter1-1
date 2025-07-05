import { getProducts, getCategories } from "./api/productApi.js";
const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

let state = {
  product: [],
  total: 0,
  loading: false,
};

function render() {
  document.querySelector("#root").innerHTML = "gd";
}
async function main() {
  render();
  state.loading = true;
  const data = await Promise.all([getProducts(), getCategories()]);
  console.log(data);
  document.body.querySelector("#root").innerHTML = "hd";
}
// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
