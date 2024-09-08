import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../layout";
import Button from "../components/button";
import Bin from "../icons/bin";

function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = JSON.parse(sessionStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  function scrapCart(id) {
    if (id) {
      const updatedCart = cart.filter((item) => item.product._id !== id);
      sessionStorage.setItem("cart", JSON.stringify(updatedCart));
      setCart(updatedCart);
    }
  }

  return (
    <Layout>
      <div className="w-9/12 pt-10 m-auto *:inline-block *:align-top">
        <div className="w-3/5">
          <h3 className="font-medium text-2xl text-gray-700 mb-5">Bag</h3>
          {cart?.length
            ? cart.map((item, i) => (
                <div key={i} className={i}>
                  <div className="*:inline-block *:align-top">
                    <img
                      className="w-1/4 h-24 object-contain p-4 bg-gray-100 mr-4"
                      src={item.product.image}
                      alt={item.product.name}
                    />
                    <div className="w-4/12">
                      <h4
                        onClick={() =>
                          navigate(`/product/${item.product.slug}`)
                        }
                      >
                        {item.product.name}
                      </h4>
                      <h5 className="font-light text-gray-500">
                        {item.product.category} Shoes
                      </h5>
                      <h5 className="text-sm font-light text-gray-500 pt-2">
                        Size: {item.size}
                      </h5>
                      <h5 className="text-sm font-light text-gray-500 p2-2">
                        Color: {item.color}
                      </h5>
                    </div>
                    <div className="w-3/12 mr-4 text-right">
                      {item.product.discount && item.product.discount > 0 ? (
                        <h4 className="flex flex-col mb-8">
                          <span>
                            {"$" +
                              (
                                item.product.price -
                                (item.product.price * item.product.discount) /
                                  100
                              ).toFixed(2)}
                          </span>
                          <span className="text-gray-300 line-through">
                            {"$" + item.product.price?.toFixed(2)}
                          </span>
                        </h4>
                      ) : (
                        <h4 className="mb-12">
                          {"$" + item.product.price?.toFixed(2)}
                        </h4>
                      )}
                      <button onClick={(_) => scrapCart(item.product._id)}>
                        <Bin />
                      </button>
                    </div>
                  </div>

                  <hr className="h-px my-8 bg-gray-200 w-11/12" />
                </div>
              ))
            : "There are no items in your bag"}
        </div>
        <div className="w-2/5 text-gray-700">
          <h3 className="font-medium text-xl text-gray-700 mb-5">Summary</h3>
          <div className="mb-3">
            <h5 className="inline-block w-9/12">Subtotal</h5>
            <h5 className="inline-block w-3/12 text-right">
              {"$" +
                cart
                  ?.reduce(
                    (i, { product }) =>
                      i +
                      product.price -
                      (product.price * product.discount) / 100,
                    0,
                  )
                  .toFixed(2)}
            </h5>
          </div>
          <div className="">
            <h5 className="inline-block w-9/12">Tax</h5>
            <h5 className="inline-block w-3/12 text-right">
              {"$" +
                cart
                  ?.reduce(
                    (i, { product }) =>
                      i +
                      (product.price -
                        (product.price * product.discount) / 100) *
                        0.088,
                    0,
                  )
                  .toFixed(2)}
            </h5>
          </div>
          <hr className="h-px my-5 bg-gray-200" />
          <div className="">
            <h5 className="inline-block w-9/12">Total</h5>
            <h5 className="inline-block w-3/12 text-right font-medium text-gray-900">
              {"$" + cart?.reduce((i, { price }) => i + price, 0).toFixed(2)}
            </h5>
          </div>
          <hr className="h-px my-5 bg-gray-200" />
          <Button text="Checkout" onClick={() => navigate("/checkout")} />
        </div>
      </div>
    </Layout>
  );
}

export default Cart;
