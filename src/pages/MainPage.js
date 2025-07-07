import { Layout } from "../components/layout/Layout.js";
import { Header } from "../components/layout/Header.js";
import { Body } from "../components/layout/Body.js";
import { Footer } from "../components/layout/Footer.js";
import { SearchFilter } from "../components/searchFilter/SearchFilter.js";
import { getProducts } from "../api/productApi.js";
import { ProductList } from "../components/productList/ProductList.js";

export const MainPage = async () => {
  const data = await getProducts();
  console.log(data);

  return Layout(Header() + Body(SearchFilter(), ProductList()) + Footer());
};
