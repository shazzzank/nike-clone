import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/layout";
import Button from "../components/button";
import Bin from "../icons/bin";
import { getDiscountedPrice, getTax, getTaxedPrice } from "../helper";
import { deleteCart } from "../server";

function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  const position = {
    container: "flex flex-col md:flex-row gap-16 w-9/12 m-auto",
    leftwrapper: "md:w-3/5 *:mb-5",
    rightwrapper: "md:w-2/5 *:mb-5",
  };
  const design = {
    heading: "font-medium text-xl text-gray-700",
  };

  useEffect(() => {
    setCart(JSON.parse(sessionStorage.getItem("cart")));
  }, []);

  function onClick() {
    let route = "/checkout/guest";
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user && Object.keys(user).length) {
      route = "/checkout/member";
    }
    navigate(route);
  }

  function removeItem(cartId) {
    const filteredCart = cart.filter((item) => item._id !== cartId);
    deleteCart({ _id: cartId });
    setCart(filteredCart);
    sessionStorage.setItem("cart", JSON.stringify(filteredCart));
  }

  return (
    <Layout>
      <div className={position.container}>
        <div className={position.leftwrapper}>
          <h2 className={design.heading}>Bag</h2>
          {cart?.length > 0 ? (
            cart.map((item) => (
              <div key={item.product._id}>
                <Card
                  productName={item.product.name}
                  productImage={item.product.image}
                  productCategory={item.product.category}
                  productPrice={item.product.price}
                  productDiscount={item.product.discount}
                  productSize={item.size}
                  productColor={item.color}
                  onClick={() => removeItem(item._id)}
                />
                <hr />
              </div>
            ))
          ) : (
            <p>There are no items in your bag</p>
          )}
        </div>
        <div className={position.rightwrapper}>
          <h2 className={design.heading}>Summary</h2>
          {cart?.length > 0 && (
            <Price
              price={cart.reduce((i, item) => i + item.product.price, 0)}
              discount={cart.reduce((i, item) => i + item.product.discount, 0)}
              onClick={onClick}
            />
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Cart;

function Card(props) {
  const position = {
    container: "flex mb-4",
    c_container: "grid grid-cols-2 grid-rows-2 gap-4 mx-4 w-full",
    c_wrapper: "flex flex-col",
    c_rightwrapper: "items-end",
    c_bottomwrapper: "justify-end",
    image: "w-1/4 p-4",
  };
  const design = {
    textstrike: "text-gray-300 line-through",
    text: "font-light text-gray-500",
    subtext: "font-light text-sm text-gray-500",
    image: "bg-gray-100 object-contain",
  };

  return (
    <div className={position.container}>
      <img
        className={`${position.image} ${design.image}`}
        src={props.productImage}
        alt={props.productName}
      />
      <div className={position.c_container}>
        <div className={position.c_wrapper}>
          <p>{props.productName}</p>
          <p className={design.text}>{props.productCategory} Shoes</p>
        </div>
        <div className={`${position.c_wrapper} ${position.c_rightwrapper}`}>
          <p>
            ${getDiscountedPrice(props.productPrice, props.productDiscount)}
          </p>
          <p className={design.textstrike}>${props.productPrice}</p>
        </div>
        <div className={`${position.c_wrapper} ${position.c_bottomwrapper}`}>
          <p className={design.subtext}>Size: {props.productSize}</p>
          <p className={design.subtext}>Color: {props.productColor}</p>
        </div>
        <div
          className={`${position.c_wrapper} ${position.c_rightwrapper} ${position.c_bottomwrapper}`}
        >
          <Bin onClick={props.onClick} />
        </div>
      </div>
    </div>
  );
}

function Price(props) {
  const position = {
    item: "flex justify-between my-3",
    separator: "h-px my-5",
    buttonWrapper: "*:w-full *:py-3",
  };
  const design = {
    item: "text-gray-700",
    heading: "font-medium text-xl text-gray-700",
    text: "font-medium text-gray-900",
    separator: "text-gray-200",
    buttonWrapper: "font-medium *:bg-gray-800",
  };

  return (
    <>
      <div className={`${position.item} ${design.item}`}>
        <span>Subtotal</span>
        <span>${getDiscountedPrice(props.price, props.discount)}</span>
      </div>
      <div className={`${position.item} ${design.item}`}>
        <span>Tax</span>
        <span>${getTax(props.price, props.discount)}</span>
      </div>
      <hr className={`${position.separator} ${design.separator}`} />
      <div className={`${position.item} ${design.item}`}>
        <span>Total</span>
        <span className={design.text}>
          ${getTaxedPrice(props.price, props.discount)}
        </span>
      </div>
      <hr className={`${position.separator} ${design.separator}`} />
      <div className={`${position.buttonWrapper} ${design.buttonWrapper}`}>
        <Button text="Checkout" onClick={props.onClick} />
      </div>
    </>
  );
}
