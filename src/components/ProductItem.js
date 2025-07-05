export default function ProductItem({ product }) {
  return /*html*/ `
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
        <div class="flex items-center justify-between">
            <div class="flex items-center">
                <img src="${product.image}" alt="${product.name}" class="w-16 h-16 rounded-md">
            </div>
        </div>
    </div>
    `;
}
