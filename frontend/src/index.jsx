import { createRoot } from "react-dom/client";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Home from "./pages/home";
import Product from "./pages/product";
import Collection from "./pages/collection";
import Cart from "./pages/cart";
import Checkout from "./pages/checkout";
import Success from "./pages/success";
import Favorites from "./pages/favorites";
import Register from "./pages/register";
import Login from "./pages/login";
import "./index.css";

const root = createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/product/:slug" element={<Product />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/men" element={<Collection category="Men's" />} />
      <Route path="/women" element={<Collection category="Women's" />} />
      <Route path="/success" element={<Success />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  </BrowserRouter>,
);

// pending:
// 1. add qty tab in cart/product
// 2. edit option in checkout
// 3. search
// 4. login/admin pages
