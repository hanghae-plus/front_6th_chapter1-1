export const CategoryFilter = (categories, category1, category2) => {
  const mainCategories = categories && typeof categories === "object" ? Object.keys(categories) : [];
  const subCategories =
    category1 && categories?.[category1] && typeof categories[category1] === "object"
      ? Object.keys(categories[category1])
      : [];

  return `
      ${
        !category1
          ? /* html */ `
          <!-- 1depth 카테고리 -->
          <div class="flex flex-wrap gap-2">
            ${
              mainCategories.length === 0
                ? `<div class="text-sm text-gray-500 italic">카테고리 로딩 중...</div>`
                : mainCategories
                    .map(
                      (category) => `
                      <button data-category1="${category}" class="category1-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
                        ${category}
                      </button>
                    `,
                    )
                    .join("")
            }
          </div>
          `
          : ""
      }
          <!-- 2depth 카테고리 -->
          ${
            subCategories.length > 0
              ? `
            <div class="space-y-2">
              <div class="flex flex-wrap gap-2">
                ${subCategories
                  .map(
                    (subcat) => `
                  <button data-category1="${category1}" data-category2="${subcat}" class="category2-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors
                     ${category2 === subcat ? "bg-blue-100 border-blue-300 text-blue-800" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"}">
                    ${subcat}
                  </button>
                `,
                  )
                  .join("")}
              </div>
            </div>
          `
              : ""
          }
        </div>
      `;
};
