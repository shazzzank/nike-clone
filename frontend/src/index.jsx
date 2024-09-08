import { createRoot } from "react-dom/client";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Home from "./pages/home";
import Collection from "./pages/collection";
import Product from "./pages/product";
import Cart from "./pages/cart";
import Checkout from "./pages/checkout";
import Success from "./pages/success";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import Favorite from "./pages/favorite";
import "./styles.css";

const root = createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/collection/men" element={<Collection category="Men's" />} />
      <Route
        path="/collection/women"
        element={<Collection category="Women's" />}
      />
      <Route path="/product/:slug" element={<Product />} />
      <Route path="/favorite" element={<Favorite />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout/:route" element={<Checkout />} />
      <Route path="/success" element={<Success />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard/:route" element={<Dashboard />} />
    </Routes>
  </BrowserRouter>,
);

//TODO : inquiries and reviews in user dashboard
//Integrate preferences in online shopping
//search with auto complete
