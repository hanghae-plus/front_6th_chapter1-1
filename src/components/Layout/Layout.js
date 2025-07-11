import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { ToastContainer } from "../common/Toast.js";

export const Layout = (content, navbarOptions = {}) => /* html */ `
<div class="min-h-screen bg-gray-50">
  ${Navbar({ ...navbarOptions })}
  <main class="max-w-md mx-auto px-4 py-4">${content}</main>
  ${Footer()}
  ${ToastContainer()}
</div>
`;
