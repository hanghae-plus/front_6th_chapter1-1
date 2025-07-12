import Layout from "../components/Layout";
import routes from "../routes";
import { getAppPath } from "../main";

let currentPage = null;

const useRender = () => {
  const init = () => {
    document.querySelector("#root").innerHTML = Layout();
  };
  const draw = (tag, html) => {
    if (!tag) return;
    document.querySelector(tag).innerHTML = html;
  };

  const view = async () => {
    // 이전 페이지의 unmount 호출
    if (currentPage && currentPage.unmount) {
      currentPage.unmount();
    }

    for (const route of routes) {
      const match = getAppPath().match(route.path);
      if (!match) continue;
      const Page = route.component;
      currentPage = Page; // 현재 페이지 저장
      Page.init?.(match?.[1]);
      draw("main", Page({}));
      await Page.mount?.();
      return; // 매치된 첫 번째 라우트만 실행하고 멈추게
    }
  };

  return { init, draw, view };
};

export default useRender;
