import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "./topbar";
import LogoIcon from "../../icons/logo";
import HeartIcon from "../../icons/heart";
import CartIcon from "../../icons/cart";
import SearchIcon from "../../icons/search";
import Badge from "../badge";

function Header() {
  const [cart, setCart] = useState(null);
  const navigate = useNavigate();
  const position = {
    container: "flex justify-between px-5 py-2",
    wrapper: "flex justify-end gap-4 items-center",
    inputwrapper: "flex py-1.5 px-2 w-2/5",
    input: "w-full px-1",
  };
  const design = {
    container: "border",
    inputwrapper: "bg-gray-100 rounded-3xl",
    input: "outline-none bg-transparent",
    text: "font-medium cursor-pointer",
  };

  useEffect(() => {
    setCart(JSON.parse(sessionStorage.getItem("cart")) || []);
  }, []);

  return (
    <>
      <Topbar />
      <div className={`${position.container} ${design.container}`}>
        <div className={design.text} onClick={() => navigate("/")}>
          <LogoIcon />
        </div>
        <div className={position.wrapper}>
          <div onClick={() => navigate("/collection/men")}>
            <p className={design.text}>Men</p>
          </div>
          <div onClick={() => navigate("/collection/women")}>
            <p className={design.text}>Women</p>
          </div>
          <div className={`${position.inputwrapper} ${design.inputwrapper}`}>
            <SearchIcon />
            <input
              className={`${position.input} ${design.input}`}
              placeholder="Search"
            />
          </div>
          <HeartIcon
            className={design.text}
            onClick={() => navigate("/favorite")}
          />
          <Badge
            className={design.text}
            count={cart?.length > 0 ? cart.length : null}
            component={<CartIcon onClick={() => navigate("/cart")} />}
          />
        </div>
      </div>
    </>
  );
}

export default Header;
