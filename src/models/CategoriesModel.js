import { getCategories } from "../api/productApi.js";

export class CategoriesModel {
  constructor() {
    this.state = {
      categories: [],
      loading: true,
    };
    this.subscribers = [];
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    callback({ ...this.state });

    return () => {
      this.subscribers = this.subscribers.filter((cb) => cb !== callback);
    };
  }

  notify() {
    this.subscribers.forEach((callback) => callback({ ...this.state }));
  }

  transformCategoryData(rawCategories) {
    const categories = [];

    Object.keys(rawCategories).forEach((categoryName) => {
      const subcategories = rawCategories[categoryName];

      const isSubcategory = Object.keys(rawCategories).some(
        (parentName) =>
          parentName !== categoryName &&
          rawCategories[parentName] &&
          typeof rawCategories[parentName] === "object" &&
          Object.prototype.hasOwnProperty.call(rawCategories[parentName], categoryName),
      );

      if (!isSubcategory) {
        const category = {
          name: categoryName,
          subcategories: [],
        };

        if (subcategories && typeof subcategories === "object") {
          category.subcategories = Object.keys(subcategories);
        }

        categories.push(category);
      }
    });

    return categories;
  }

  async fetchCategories() {
    this.state.loading = true;
    this.notify();

    const rawCategories = await getCategories();
    const transformedCategories = this.transformCategoryData(rawCategories);

    this.state.categories = transformedCategories;
    this.state.loading = false;
    this.notify();
  }

  async initialize() {
    await this.fetchCategories();
  }

  getState() {
    return { ...this.state };
  }
}
