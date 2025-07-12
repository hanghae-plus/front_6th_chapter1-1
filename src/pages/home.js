import { header } from "../components/header.js";
import { footer } from "../components/footer.js";
import { ProductList } from "../components/ProductList.js";
import { searchNcategoriesComp } from "../components/searchNcategoriesComp.js";

export const home = (props) => {
  return /*html*/ `
    ${header(props)} 
    <main class="max-w-md mx-auto px-4 py-4">
      ${searchNcategoriesComp(props)} 
      ${ProductList(props)}
    </main>
    ${footer()}
  `;
};
