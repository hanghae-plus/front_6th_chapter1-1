import { screen } from "@testing-library/dom";
import { userEvent } from "@testing-library/user-event";
import { beforeEach } from "vitest";
import { afterEach, beforeAll, describe, expect, test } from "vitest";

const goTo = (path) => {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new Event("popstate"));
};

beforeAll(async () => {
  document.body.innerHTML = '<div id="root"></div>';
  await import("../main.js");
});

beforeEach(() => {
  goTo("/");
});

afterEach(() => {
  // 각 테스트 후 상태 초기화
  document.getElementById("root").innerHTML = "";
  localStorage.clear();
});

const 상품_상세페이지_접속 = async () => {
  const productElement = await screen.findByRole("heading", {
    level: 3,
    name: /pvc 투명 젤리 쇼핑백/i,
  });
  const productCard = productElement.closest(".product-card");
  const productImage = productCard.querySelector("img");

  expect(productImage).toBeInTheDocument();

  // 상품 이미지 클릭
  await userEvent.click(productImage);

  await screen.findByRole("heading", {
    level: 1,
    name: "PVC 투명 젤리 쇼핑백 1호 와인 답례품 구디백 비닐 손잡이 미니 간식 선물포장",
  });
};

describe("1. 상품 클릭시 상세 페이지 이동", () => {
  test("상품 목록에서 상품 이미지 클릭 시 상세 페이지로 이동되며, 상품 이미지, 설명, 가격 등의 상세 정보가 표시된다", async () => {
    goTo("/");
    await 상품_상세페이지_접속();

    // 상품 상세 페이지가 로드되었는지 확인
    expect(await screen.findByText("상품 상세")).toBeInTheDocument();

    // 상품 제목 확인
    expect(
      await screen.findByText("PVC 투명 젤리 쇼핑백 1호 와인 답례품 구디백 비닐 손잡이 미니 간식 선물포장"),
    ).toBeInTheDocument();

    // 상품 이미지 확인
    expect(
      screen.getByAltText("PVC 투명 젤리 쇼핑백 1호 와인 답례품 구디백 비닐 손잡이 미니 간식 선물포장"),
    ).toBeInTheDocument();

    // 가격 정보 확인
    expect(screen.getByText("220원")).toBeInTheDocument();
  });
});

describe("2. 상품 상세 - 장바구니 담기", () => {
  test("상품 상세 페이지에서 해당 상품을 장바구니에 추가할 수 있다", async () => {
    await 상품_상세페이지_접속();

    // 장바구니 담기 버튼 찾기
    const addToCartButton = document.querySelector("#add-to-cart-btn");

    // 장바구니 담기 버튼 클릭
    addToCartButton.click();

    await screen.findByText("장바구니에 추가되었습니다");
  });

  test("페이지 내에서 수량을 입력 혹은 선택하여 장바구니에 추가할 수 있다", async () => {
    await 상품_상세페이지_접속();

    document.querySelector("#quantity-increase").click();
    expect(document.querySelector("#quantity-input").value).toBe("2");

    document.querySelector("#quantity-decrease").click();
    expect(document.querySelector("#quantity-input").value).toBe("1");

    // 1보다 작게 감소하지 않는지 확인
    document.querySelector("#quantity-decrease").click();
    expect(document.querySelector("#quantity-input").value).toBe("1");

    // 장바구니 담기 버튼 클릭
    await userEvent.click(document.querySelector("#add-to-cart-btn"));

    // 성공 메시지 확인
    expect(await screen.findByText("장바구니에 추가되었습니다")).toBeInTheDocument();
  });
});

describe("3. 관련 상품 기능", () => {
  test("상품 상세 페이지에서 현재 상품을 제외한 관련 상품들이 표시되고, 관련 상품 클릭 시 해당 상품의 상세 페이지로 이동한다", async () => {
    await 상품_상세페이지_접속();

    // 관련 상품 섹션이 있는지 확인
    expect(screen.queryByText("관련 상품")).not.toBeInTheDocument();
    expect(await screen.findByText("관련 상품")).toBeInTheDocument();

    // 관련 상품 카드들이 있는지 확인
    const relatedProductCards = [...document.querySelectorAll(".related-product-card")];
    expect(relatedProductCards.length).toBe(19);

    expect(document.querySelector(".related-product-card [data-product-id='85067212996']")).toBe(null);

    // 관련 상품 클릭
    await userEvent.click(relatedProductCards[0]);
    await screen.findByRole("heading", {
      level: 1,
      name: "샷시 풍지판 창문 바람막이 베란다 문 틈막이 창틀 벌레 차단 샤시 방충망 틈새막이",
    });
  });
});
