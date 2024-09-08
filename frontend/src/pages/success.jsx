import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Checkmark } from "react-checkmark";
import Layout from "../layout";
import Button from "../components/button";

function Success() {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user")) || {};
  const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
  const shipping = JSON.parse(sessionStorage.getItem("shipping")) || {};
  const payment = JSON.parse(sessionStorage.getItem("payment")) || {};
  const orderId = JSON.parse(sessionStorage.getItem("orderId")) || null;

  function goBack() {
    navigate("/");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("cart");
    sessionStorage.removeItem("shipping");
    sessionStorage.removeItem("payment");
    sessionStorage.removeItem("orderId");
  }

  useEffect(() => {
    if (orderId === null) {
      const createOrder = async () => {
        try {
          const userRes = await axios.post("/user/create", user);
          const cartRes = await axios.post(
            "/cart/create",
            cart.map((item) => ({ ...item, product: item.product._id })),
          );
          const orderRes = await axios.post("/order/create", {
            user: userRes.data._id,
            cart: cartRes.data._id,
            amount:
              cart.reduce((i, { price }) => i + price, 0) + shipping.price,
            delivery_date: new Date(
              shipping.date.match(/(\w{3} \d{1,2})/g).pop() +
                " " +
                new Date().getFullYear(),
            ),
          });
          sessionStorage.setItem("orderId", JSON.stringify(orderRes.data._id));
          await axios.post("/payment/create", {
            order: orderRes.data._id,
            mode: payment.mode,
            promo: payment.promo,
            amount:
              cart.reduce((i, { price }) => i + price, 0) + shipping?.price,
            status: payment.mode === "Card" ? "Paid" : "Pending",
          });
        } catch (err) {
          console.log(err);
        }
      };
      createOrder();
    }
  }, []);

  return (
    <Layout>
      <div className="my-20">
        <Checkmark size="10rem" />
        <div className="text-center my-10 *:my-3">
          <h2 className="font-medium text-2xl">Order placed successfully!</h2>
          <div className="font-medium text-xl w-1/4 m-auto">
            <hr className="h-px my-4 bg-gray-200" />
            <div className="flex justify-between">
              <h4 className="text-gray-400">Total</h4>
              <h4>
                {"$" +
                  (
                    cart.reduce((i, { price }) => i + price, 0) + shipping.price
                  ).toFixed(2)}
              </h4>
            </div>
            <hr className="h-px my-4 bg-gray-200" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 w-3/4 mx-auto pb-5">
          <div className="text-center">
            <h4 className="font-medium text-lg">Your Information</h4>
            <p className="capitalize">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="lowercase">{user?.email}</p>
            <p>{user?.phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")}</p>
          </div>
          <div className="text-center">
            <h4 className="font-medium text-lg">Payment Information</h4>
            {payment?.mode === "Cash" ? (
              <p>Cash on Delivery</p>
            ) : (
              <div>
                <p>Card Payment</p>
                <p>XXXX-XXXX-XXXX-{payment?.card_number.slice(-2)}</p>
                <p>{payment?.expiry_month + " / " + payment?.expiry_year}</p>
              </div>
            )}
          </div>
          <div className="text-center">
            <h4 className="font-medium text-lg">Delivery Information</h4>
            <p>{user?.address}</p>
          </div>
          <div className="text-center">
            <h4 className="font-medium text-lg">Shipping Information</h4>
            <p>{shipping?.date}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-5 justify-center items-center my-10">
          {cart?.map((item) => (
            <div key={item.product._id}>
              <div className="w-36 h-36 border border-gray-200 rounded-md bg-gray-100">
                <img
                  className="h-full p-2 object-contain"
                  src={item.product.image}
                  alt={item.product.name}
                  onClick={() => navigate(`/product/${item.product.slug}`)}
                />
              </div>
              <p className="font-medium text-center pt-2">
                {item.product.name}
              </p>
            </div>
          ))}
        </div>
        <div className="flex w-1/2 m-auto" onClick={() => goBack()}>
          <Button text="Return Home" />
        </div>
      </div>
    </Layout>
  );
}

export default Success;
