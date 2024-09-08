import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../layout";
import Slider from "../components/slider";
import Toast from "../components/toast";
import Button from "../components/button";
import HeartIcon from "../icons/heart";
import StarFull from "../icons/starfull";
import StarDry from "../icons/stardry";

function Product() {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState([]);
  const [size, setSize] = useState(0);
  const [color, setColor] = useState("");
  const [index, setIndex] = useState(0);
  const [message, setMessage] = useState("");
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .post("https://nike-clone-gamma-snowy.vercel.app/product", { slug: slug })
      .then((res) => setProduct(res.data[0]))
      .catch((err) => console.log(err));
  }, [slug]);

  useEffect(() => {
    product &&
      axios
        .post("https://nike-clone-gamma-snowy.vercel.app/products", {
          category: product.category,
          minprice: product.price - 100,
          maxprice: product.price + 100,
        })
        .then((res) => setProducts(res.data))
        .catch((err) => console.log(err));
  }, [product]);

  function setCart() {
    if (product && size && color) {
      const prevCart = JSON.parse(sessionStorage.getItem("cart")) || [];
      const discount_price =
        product.price - (product.price * product.discount) / 100;
      const total_price = discount_price + discount_price * 0.088;
      const data = {
        product,
        quantity: 1,
        price: total_price,
        size,
        color,
      };
      sessionStorage.setItem("cart", JSON.stringify([...prevCart, data]));
      setMessage("Item added successfully to cart!");
      setTimeout(() => {
        navigate("/cart");
      }, 1000);
    }
  }

  function setFavorite(product) {
    const prevFavorites = JSON.parse(sessionStorage.getItem("favorites")) || [];
    sessionStorage.setItem(
      "favorites",
      JSON.stringify([...prevFavorites, product]),
    );
    navigate("/favorites");
  }

  return (
    <Layout>
      <Toast message={message} />
      <div className="w-4/5 mt-10 m-20">
        {product && (
          <div key={product._id} className="flex sm:gap-2 md:gap-10 *:p-4">
            <div className="w-3/5">
              <img
                className="sticky top-0 w-11/12 m-auto bg-gray-100 px-5 object-contain border border-transparent rounded-xl"
                src={product.image}
                alt={product.name}
                style={{ height: "85vh" }}
              />
            </div>
            <div className="w-2/5">
              <h2 className="text-2xl">{product.name}</h2>
              <p className="text-medium text-gray-500 pt-1">
                {product.category} Shoes
              </p>
              <p className="font-medium text-lg pt-4">
                {product.discount && product.discount > 0 ? (
                  <>
                    <span>
                      {"$" +
                        (
                          product.price -
                          (product.price * product.discount) / 100
                        ).toFixed(2)}
                    </span>
                    <span className="text-gray-300 px-2 line-through">
                      {"$" + product.price?.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span>{"$" + product.price?.toFixed(2)}</span>
                )}
              </p>
              <div className="flex flex-wrap gap-2 mt-10 mb-8">
                {product.colors?.map((pColor) => (
                  <div
                    key={pColor}
                    className={`w-20 h-20 border border-gray-200 rounded-md hover:border-gray-700 ${
                      pColor === color && "border-gray-700"
                    } bg-${pColor}-400`}
                    onClick={() => setColor(pColor)}
                  >
                    <img
                      className="h-full p-2 object-contain"
                      src={product.image}
                      alt={product.name}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between mb-2">
                <p className="font-medium">Select Size</p>
                <p className="text-gray-500">Size Guide</p>
              </div>
              <div className="grid grid-cols-4 gap-1 mb-8">
                {[...Array(15)].map((_, i) => {
                  const sizeValue = 5 + i / 2;
                  const isSizeMatched =
                    product.size?.some((size) => size === sizeValue) ?? false;
                  return (
                    <p
                      key={i}
                      className={`text-center border border-gray-200 rounded-md py-2 cursor-pointer hover:border-gray-700 ${
                        index === i && "border-gray-700"
                      } ${
                        isSizeMatched &&
                        "bg-gray-100 text-gray-300 border-gray-100"
                      }`}
                      onClick={() => {
                        setSize(sizeValue);
                        setIndex(i);
                      }}
                    >
                      {sizeValue}
                    </p>
                  );
                })}
              </div>
              <Button text="Add to Bag" onClick={() => setCart()} />
              <Button
                text="Favorite"
                icon={HeartIcon}
                type="white"
                onClick={() => setFavorite(product)}
              />
              <div className="mt-10">
                <h4 className="font-medium text-lg text-gray-700">Shipping</h4>
                <p className="mt-1 text-gray-600">
                  You'll see our shipping options at checkout
                </p>
                <p className="mt-6">
                  Free Pickup → &nbsp;
                  <span className="text-gray-500">Find a Store</span>
                </p>
                <p className="mt-10 mb-5 text-gray-600">
                  {product.description}
                </p>
              </div>
              <div>
                <hr className="h-px my-8 bg-gray-200" />
                <h4 className="font-medium text-lg text-gray-700 mb-5">
                  Shipping & Returns
                </h4>
                <p className="text-gray-600">
                  Free standard shipping on orders $50+ and free 60-day returns
                  for community members.
                </p>
                <hr className="h-px my-8 bg-gray-200" />
                <h4 className="flex justify-between font-medium text-lg text-gray-700 mb-2">
                  <span>
                    Reviews ({product.review ? product.review.length : 0})
                  </span>
                  <Rating count={product.rating} />
                </h4>
                {product.review &&
                  product.review.map((rev, index) => (
                    <div key={index} className="*:text-sm pt-3">
                      <p className="font-medium mt-2 mb-2">{rev.name}</p>
                      <p className="text-gray-600">{rev.review}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
        <div className="p-6">
          <Slider
            products={products}
            heading="Similar Products"
            subheading=""
          />
        </div>
      </div>
    </Layout>
  );
}

function Rating(props) {
  return (
    <div className="flex gap-1 scale-75">
      {[...Array(5)].map((_, i) => (
        <div key={i}>
          {i < Math.floor(props.count) ? <StarFull /> : <StarDry />}
        </div>
      ))}
    </div>
  );
}

export default Product;
