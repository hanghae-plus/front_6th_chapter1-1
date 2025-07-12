import { getByRole, screen, waitFor } from "@testing-library/dom";
import { afterEach, beforeAll, beforeEach, describe, expect, test } from "vitest";
import { server } from "./mockServerHandler.js";
import { userEvent } from "@testing-library/user-event";

const goTo = (path) => {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new Event("popstate"));
};

beforeAll(async () => {
  document.body.innerHTML = '<div id="root"></div>';
  await import("../main.js");
});

beforeEach(() => goTo("/"));

afterEach(() => {
  // 각 테스트 후 상태 초기화
  document.getElementById("root").innerHTML = "";
  localStorage.clear();
  server.resetHandlers();
});

describe("1. 상품 목록 로딩", () => {
  test("페이지 접속 시 로딩 상태가 표시되고, 데이터 로드 완료 후 상품 목록이 렌더링된다", async () => {
    expect(screen.getByText("카테고리 로딩 중...")).toBeInTheDocument();
    expect(screen.queryByText(/총 의 상품/i)).not.toBeInTheDocument();

    // 상품 모두 렌더링되었는지 확인
    expect(
      await screen.findByText(/pvc 투명 젤리 쇼핑백 1호 와인 답례품 구디백 비닐 손잡이 미니 간식 선물포장/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/고양이 난간 안전망 복층 베란다 방묘창 방묘문 방충망 캣도어 일반형검정/i),
    ).toBeInTheDocument();

    expect(screen.getByText(/총 의 상품/i)).toBeInTheDocument();
    expect(screen.getByText("340개")).toBeInTheDocument();
  });
});

describe("2. 상품 목록 조회", () => {
  test("각 상품의 기본 정보(이미지, 상품명, 가격)가 카드 형태로 표시된다", async () => {
    // 첫 번째 상품이 로드될 때까지 대기
    await screen.findByText(/pvc 투명 젤리 쇼핑백/i);

    // 상품 카드들이 존재하는지 확인
    const productCards = document.querySelectorAll(".product-card, [data-product-id]");
    expect(productCards.length).toBeGreaterThan(0);

    // 첫 번째 상품 카드에서 기본 정보들 확인
    const firstProduct = productCards[0];

    // 이미지 확인
    const productImage = firstProduct.querySelector("img");
    expect(productImage).toBeInTheDocument();
    expect(productImage.src).toBeTruthy();

    // 상품명 확인
    expect(firstProduct.textContent).toMatch(/pvc 투명 젤리 쇼핑백|고양이 난간 안전망/i);

    // 가격 확인 (숫자와 원이 포함된 텍스트)
    expect(firstProduct.textContent).toMatch(/\d{1,3}(,\d{3})*원/);

    // 장바구니 버튼 확인
    const cartButton = firstProduct.querySelector(".add-to-cart-btn, button");
    expect(cartButton).toBeInTheDocument();
  });
});

describe("3. 페이지당 상품 수 선택", () => {
  test("드롭다운에서 10, 20, 50, 100개 중 선택할 수 있으며 기본값은 20개이다", async () => {
    // 상품이 로드될 때까지 대기
    await screen.findByText(/총 의 상품/i);

    // 페이지당 상품 수 선택 드롭다운 찾기
    const limitSelect = document.querySelector("#limit-select");
    expect(limitSelect).toBeInTheDocument();

    // 기본값이 20개인지 확인
    expect(limitSelect.value).toBe("20");

    // 옵션들이 올바르게 있는지 확인
    const options = Array.from(limitSelect.options).map((opt) => opt.value);
    expect(options).toContain("10");
    expect(options).toContain("20");
    expect(options).toContain("50");
    expect(options).toContain("100");
  });

  test("선택 변경 시 즉시 목록에 반영된다", async () => {
    await screen.findByText(/총 의 상품/i);

    expect(
      await screen.findByRole("heading", {
        level: 3,
        name: "창틀벌레 모풍지판 창문 벌레 차단 틈새 창문틈 막이 방충망",
      }),
    ).toBeInTheDocument();

    const limitSelect = document.querySelector("#limit-select");
    await userEvent.selectOptions(limitSelect, "10");

    await waitFor(() =>
      expect(
        screen.queryByRole("heading", {
          level: 3,
          name: "창틀벌레 모풍지판 창문 벌레 차단 틈새 창문틈 막이 방충망",
        }),
      ).not.toBeInTheDocument(),
    );

     await waitFor(() => {
      const productCards = document.querySelectorAll(".product-card");
      expect(productCards).toHaveLength(10);
    });
  });
});

describe("4. 상품 정렬 기능", () => {
  test("상품을 가격순/인기순으로 정렬할 수 있다", async () => {
    await screen.findByText(/총 의 상품/i);

    // 정렬 드롭다운 찾기
    const sortSelect = document.querySelector("#sort-select");
    expect(sortSelect).toBeInTheDocument();

    // 정렬 옵션들 확인
    const options = Array.from(sortSelect.options);
    const optionTexts = options.map((opt) => opt.textContent);

    expect(optionTexts.some((text) => text.includes("가격"))).toBe(true);
    expect(optionTexts.some((text) => text.includes("낮은순") || text.includes("높은순"))).toBe(true);
  });

  test("정렬 변경 시 목록에 반영된다", async () => {
    await screen.findByText(/총 의 상품/i);

    const expectProduct = (name, index = 0) => {
      const product = [...document.querySelectorAll(".product-card")][index];
      expect(getByRole(product, "heading", { level: 3, name })).toBeInTheDocument();
    };

    await userEvent.selectOptions(document.querySelector("#sort-select"), "price_desc");
    await waitFor(() => {
      expectProduct("ASUS ROG Flow Z13 GZ302EA-RU110W 64GB, 1TB");
    });

    await userEvent.selectOptions(document.querySelector("#sort-select"), "name_asc");
    await waitFor(() => {
      expectProduct("[1+1] 춘몽 섬유탈취제 섬유향수 룸스프레이 도플 패브릭 퍼퓸 217ml 블랑쉬");
    });

    await userEvent.selectOptions(document.querySelector("#sort-select"), "name_desc");
    await waitFor(() => {
      expectProduct(/다우니 울트라 섬유유연제 에이프릴 프레쉬/i, 1);
    });

    await userEvent.selectOptions(document.querySelector("#sort-select"), "price_asc");
    await waitFor(() => {
      expectProduct("샷시 풍지판 창문 바람막이 베란다 문 틈막이 창틀 벌레 차단 샤시 방충망 틈새막이", 1);
    });
  });
});

describe("5. 무한 스크롤 페이지네이션", () => {
  test("페이지 하단 스크롤 시 추가 상품이 로드된다", async () => {
    await screen.findByText(/총 의 상품/i);

    // 초기 상품 카드 수 확인
    const initialCards = document.querySelectorAll(".product-card").length;
    expect(initialCards).toBe(20);

    // 페이지 하단으로 스크롤
    window.dispatchEvent(new Event("scroll"));

    expect(await screen.findByText("상품을 불러오는 중...")).toBeInTheDocument();
    expect(
      await screen.findByText("고양이 난간 안전망 복층 베란다 방묘창 방묘문 방충망 캣도어 일반형검정1mx1m"),
    ).toBeInTheDocument();
  });
});

describe("6. 상품 검색", () => {
  test("상품명 기반 검색을 위한 텍스트 입력 필드가 있다", async () => {
    await screen.findByText(/총 의 상품/i);

    // 검색 입력 필드 확인
    const searchInput = document.querySelector("#search-input");
    expect(searchInput).toBeInTheDocument();
    expect(searchInput.placeholder).toMatch(/검색/i);
  });

  test("Enter 키로 검색이 수행할 수 있으며, 검색어와 일치하는 상품들만 목록에 표시된다", async () => {
    await screen.findByText(/총 의 상품/i);

    const searchInput = document.querySelector("#search-input");

    await userEvent.type(searchInput, "젤리");
    await userEvent.keyboard("{Enter}");

    await screen.findByText("3개");

    const productCards = [...document.querySelectorAll(".product-card")];
    expect(getByRole(productCards[0], "heading", { level: 3, name: /젤리/i })).toBeInTheDocument();
    expect(getByRole(productCards[1], "heading", { level: 3, name: /젤리/i })).toBeInTheDocument();
    expect(getByRole(productCards[2], "heading", { level: 3, name: /젤리/i })).toBeInTheDocument();
  });
});
