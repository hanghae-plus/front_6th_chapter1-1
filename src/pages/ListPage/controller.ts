import { getProducts } from "../../api/productApi";
import type { IListPageProps } from "./type";

// localStorage 키 상수
const STORAGE_KEY = "listPageFilters";

// 저장할 필터 상태 타입
interface FilterState {
  limit: number;
  search: string;
  sort: string;
}

export class ListPageController {
  private state: Omit<IListPageProps, "limit" | "search" | "sort"> = { products: [], total: 0, loading: false };
  private limit = 20;
  private search = "";
  private sort = "price_asc";
  private currentPage = 1;
  private hasMore = true;
  private loadingMore = false;

  constructor() {
    // 생성자에서 localStorage에서 상태 복원
    this.loadFromLocalStorage();
  }

  /**
   * localStorage에서 필터 상태 복원
   */
  private loadFromLocalStorage(): void {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const filterState: FilterState = JSON.parse(saved);

        // 유효한 값인지 검증 후 복원
        if (typeof filterState.limit === "number" && filterState.limit > 0) {
          this.limit = filterState.limit;
        }
        if (typeof filterState.search === "string") {
          this.search = filterState.search;
        }
        if (typeof filterState.sort === "string" && filterState.sort) {
          this.sort = filterState.sort;
        }
      }
    } catch (error) {
      // localStorage 파싱 에러 시 기본값 유지
      console.warn("Failed to load filter state from localStorage:", error);
    }
  }

  /**
   * 현재 필터 상태를 localStorage에 저장
   */
  private saveToLocalStorage(): void {
    try {
      const filterState: FilterState = {
        limit: this.limit,
        search: this.search,
        sort: this.sort,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filterState));
    } catch (error) {
      // localStorage 저장 에러 시 무시 (용량 초과 등)
      console.warn("Failed to save filter state to localStorage:", error);
    }
  }

  async loadData(updateUI: (state: IListPageProps) => void) {
    this.state.loading = true;
    this.currentPage = 1;
    this.hasMore = true;
    this.loadingMore = false;
    updateUI({ ...this.state, limit: this.limit, search: this.search, sort: this.sort });

    const data = await getProducts({
      limit: this.limit,
      search: this.search,
      sort: this.sort,
      page: this.currentPage,
    });

    this.state.products = data.products;
    this.state.total = data.pagination.total;
    this.hasMore = data.pagination.hasNext;

    this.state.loading = false;
    updateUI({ ...this.state, limit: this.limit, search: this.search, sort: this.sort });
  }

  /**
   * 무한 스크롤을 위한 다음 페이지 로드
   */
  async loadMoreData(updateUI: (state: IListPageProps) => void) {
    if (this.loadingMore || !this.hasMore) return;

    this.loadingMore = true;
    this.currentPage += 1;

    // 로딩 상태 UI 업데이트
    updateUI({ ...this.state, limit: this.limit, search: this.search, sort: this.sort, loadingMore: true });

    try {
      const data = await getProducts({
        limit: this.limit,
        search: this.search,
        sort: this.sort,
        page: this.currentPage,
      });

      // 기존 상품 리스트에 새로운 상품들 추가
      this.state.products = [...this.state.products, ...data.products];
      this.state.total = data.pagination.total;
      this.hasMore = data.pagination.hasNext;

      this.loadingMore = false;
      updateUI({ ...this.state, limit: this.limit, search: this.search, sort: this.sort, loadingMore: false });
    } catch (error) {
      console.error("Failed to load more data:", error);
      this.loadingMore = false;
      this.currentPage -= 1; // 실패 시 페이지 번호 복원
      updateUI({ ...this.state, limit: this.limit, search: this.search, sort: this.sort, loadingMore: false });
    }
  }

  // limit 변경 메서드
  async setLimit(newLimit: number, updateUI: (state: IListPageProps) => void) {
    if (this.limit !== newLimit) {
      this.limit = newLimit;
      this.saveToLocalStorage(); // 상태 변경 시 저장
      await this.loadData(updateUI);
    }
  }

  // search 변경 메서드
  async setSearch(newSearch: string, updateUI: (state: IListPageProps) => void) {
    const trimmedSearch = newSearch.trim();
    if (this.search !== trimmedSearch) {
      this.search = trimmedSearch;
      this.saveToLocalStorage(); // 상태 변경 시 저장
      await this.loadData(updateUI);
    }
  }

  // sort 변경 메서드
  async setSort(newSort: string, updateUI: (state: IListPageProps) => void) {
    if (this.sort !== newSort) {
      this.sort = newSort;
      this.saveToLocalStorage(); // 상태 변경 시 저장
      await this.loadData(updateUI);
    }
  }

  // getters
  getLimit(): number {
    return this.limit;
  }

  getSearch(): string {
    return this.search;
  }

  getSort(): string {
    return this.sort;
  }

  getHasMore(): boolean {
    return this.hasMore;
  }

  getLoadingMore(): boolean {
    return this.loadingMore;
  }
}
