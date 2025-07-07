// 상품 목록 조회
export async function getProducts(params = {}) {
  const { page = 1, limit = 20, search = "", category1 = "", category2 = "", sort = "price_asc" } = params;

  const searchParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search }),
    ...(category1 && { category1 }),
    ...(category2 && { category2 }),
    sort,
  });

  const response = await fetch(`/api/products?${searchParams}`);

  return await response.json();
}

// 상품 상세 조회
export async function getProduct(productId) {
  const response = await fetch(`/api/products/${productId}`);
  return await response.json();
}

// 카테고리 목록 조회
export async function getCategories() {
  const response = await fetch("/api/categories");
  return await response.json();
}

// FOR TEST
