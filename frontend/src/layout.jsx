import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoIcon from "./icons/logo";
import SearchIcon from "./icons/search";
import WishlistIcon from "./icons/wishlist";
import CartIcon from "./icons/cart";

function App(props) {
  return (
    <>
      <Header />
      {props.children}
      <Footer />
    </>
  );
}

function Header() {
  const [cartSize, setCartSize] = useState(0);
  const navigate = useNavigate();

  useEffect((_) => {
    const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
    const orderId = JSON.parse(sessionStorage.getItem("orderId")) || "";
    cart?.length && setCartSize(cart.length);
    orderId && setCartSize(0);
  }, []);

  return (
    <>
      <div className="flex justify-end bg-gray-200 px-5 py-2">
        <ul className="flex space-x-3 text-xs font-medium *:cursor-pointer">
          <li onClick={() => navigate("/register")}>Register</li>
          <li>|</li>
          <li onClick={() => navigate("/login")}>Account</li>
        </ul>
      </div>
      <div className="flex justify-between items-center border px-5 py-2">
        <LogoIcon onClick={() => navigate("/")} />
        <div className="flex justify-end items-center space-x-3 sm:space-x-6">
          <ul className="flex space-x-6 font-medium *:cursor-pointer">
            <li onClick={() => navigate("/men")}>Men</li>
            <li onClick={() => navigate("/women")}>Women</li>
          </ul>
          <div className="flex space-x-2 bg-gray-100 hover:bg-gray-200 rounded-3xl p-1.5 w-1/4">
            <SearchIcon />
            <input
              className="bg-transparent outline-none w-full"
              name="search"
              placeholder="Search"
            />
          </div>
          <div className="flex space-x-1 *:rounded-2xl *:p-1.5">
            <button className="hover:bg-gray-200">
              <WishlistIcon onClick={() => navigate("/favorites")} />
            </button>
            <button className="relative hover:bg-gray-200">
              <CartIcon onClick={() => navigate("/cart")} />
              {cartSize > 0 && (
                <p className="absolute top-0 -right-2 text-xs bg-gray-200 rounded-3xl px-2 py-1">
                  {cartSize}
                </p>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function Footer() {
  return <footer></footer>;
}

export default App;
