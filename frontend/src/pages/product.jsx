import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/layout/layout";
import Button from "../components/button";
import Slider from "../components/slider";
import DarrowIcon from "../icons/darrow";
import { getProduct, getProducts, createCart, createFavorite } from "../server";
import { getDiscountedPrice, getTaxedPrice } from "../helper";

function Product() {
  const [product, setProduct] = useState({});
  const [products, setProducts] = useState([]);
  const [color, setColor] = useState(null);
  const [size, setSize] = useState(null);
  const { slug } = useParams();
  const navigate = useNavigate();
  const position = {
    container: "w-11/12 m-auto",
    wrapper: "flex md:gap-10",
  };
  const dropdown = [
    {
      name: "Shipping & Returns",
      description:
        "Free standard shipping on orders $50+ and free 60-day returns for community members.",
    },
    {
      name: `Reviews (${product.review ? product.review.length : 0})`,
      review: product.review,
    },
  ];

  function addToFavorites() {
    const user = JSON.parse(sessionStorage.getItem("user")) || null;
    const favorites = JSON.parse(sessionStorage.getItem("favorite")) || [];

    if (user) {
      createFavorite({ product: product._id, user: user._id });
    } else {
      sessionStorage.setItem(
        "favorite",
        JSON.stringify([...favorites, product]),
      );
    }
    navigate("/favorite");
  }

  function addToCart() {
    if (color && size) {
      const data = {
        color,
        size,
        product: product._id,
        price: getTaxedPrice(product.price, product.discount),
      };
      createCart(data, (data) => {
        const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
        if (data) {
          sessionStorage.setItem("cart", JSON.stringify([...cart, data]));
          navigate("/cart");
        } else {
          navigate(0);
        }
      });
    }
  }

  useEffect(() => {
    getProduct({ slug }, setProduct);
    getProducts({ category: product.category }, setProducts);
  }, [slug, product.category]);

  return (
    <Layout>
      {Object.keys(product).length && (
        <div className={position.container}>
          <div className={position.wrapper}>
            <Image product={product} />
            <ProductInfo
              product={product}
              size={size}
              color={color}
              setSize={setSize}
              setColor={setColor}
              dropdown={dropdown}
              addToCart={addToCart}
              addToFavorites={addToFavorites}
            />
          </div>
          <Slider heading="You Might Also Like" products={products} />
        </div>
      )}
    </Layout>
  );
}

export default Product;

function Image(props) {
  const position = { container: "w-3/5 p-4", item: "sticky top-0 p-4" };
  const design = { item: "object-contain bg-gray-100 rounded-xl" };

  return (
    <div className={position.container}>
      <img
        className={`${position.item} ${design.item}`}
        src={props.product.image}
        alt={props.product.slug}
        style={{ height: "80vh" }}
      />
    </div>
  );
}

function ProductInfo(props) {
  const position = {
    container: "w-2/5 p-4",
    name: "md:pb-1",
    discount: "flex gap-2 pt-5",
    buttons: "flex flex-col gap-3 my-5 *:py-4",
    description: "py-5",
  };
  const design = {
    name: "text-lg md:text-2xl",
    category: "text-gray-500",
    discount: "font-medium text-lg",
    price: "text-gray-400 line-through",
  };

  return (
    <div className={position.container}>
      <h1 className={`${position.name} ${design.name}`}>
        {props.product.name}
      </h1>
      <h2 className={design.category}>{props.product.category} Shoes</h2>
      <h3 className={`${position.discount} ${design.discount}`}>
        ${getDiscountedPrice(props.product.price, props.product.discount)}
        <span className={design.price}>${props.product.price}</span>
      </h3>
      <Colors
        setColor={props.setColor}
        product={props.product}
        color={props.color}
      />
      <Size
        setSize={props.setSize}
        sizes={props.sizes}
        product={props.product}
        size={props.size}
      />
      <div className={position.buttons}>
        <Button text="Add to Bag" onClick={props.addToCart} />
        <Button text="Favorite" light icon onClick={props.addToFavorites} />
      </div>
      <p className={position.description}>{props.product.description}</p>
      {props.dropdown.map((item) => (
        <Dropdown
          key={item.name}
          name={item.name}
          description={item.description}
          review={item.review}
        />
      ))}
    </div>
  );
}

function Colors(props) {
  const position = {
    container: "flex flex-wrap gap-1 mt-10 pb-8",
    item: "w-12 h-12 md:w-16 md:h-14 lg:w-16  p-2",
  };
  const design = {
    item: "border object-contain rounded-md hover:border-gray-900",
  };

  return (
    <div className={position.container}>
      {props.product.colors.map((color) => (
        <img
          key={color}
          className={`bg-${color}-400 ${position.item} ${design.item} ${
            props.color === color ? "border-gray-900" : ""
          }`}
          src={props.product.image}
          alt={color}
          onClick={() => props.setColor(color)}
        />
      ))}
    </div>
  );
}

function Size(props) {
  const position = {
    container: "grid grid-cols-3 gap-2",
    item: "h-11",
  };
  const design = {
    heading: "font-medium pb-3",
    item: "font-light border border-gray-300 text-center rounded-md cursor-pointer hover:border-gray-900",
  };

  return (
    <>
      <h3 className={design.heading}>Select Size (UK)</h3>
      <div className={position.container}>
        {[5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12].map(
          (size) => (
            <input
              key={size}
              className={`${position.item} ${design.item} ${
                !props.product.sizes.includes(size) &&
                "bg-gray-100 text-gray-300 hover:border-gray-300"
              } ${props.size === size ? "border-gray-900" : ""}`}
              value={size}
              onClick={() => props.setSize(size)}
              readOnly
            />
          ),
        )}
      </div>
    </>
  );
}

function Dropdown(props) {
  const [boolean, setBoolean] = useState(true);
  const position = {
    container: "pb-8",
    subtext: "mb-2",
    text: "mb-5",
    topbar: "flex justify-between pt-5 pb-7",
    hr: "h-px",
  };
  const design = {
    container: boolean ? "hidden" : "",
    hr: "bg-gray-200",
    text: "font-medium text-lg text-gray-700",
    subtext: "font-medium",
    topbar: "cursor-pointer",
  };

  return (
    <>
      <hr className={`${position.hr} ${design.hr}`} />
      <div
        className={`${position.topbar} ${design.topbar}`}
        onClick={() => setBoolean(!boolean)}
      >
        <h3 className={design.text}>{props.name}</h3>
        <DarrowIcon />
      </div>
      <div className={`${position.container} ${design.container}`}>
        {props.description && <p>{props.description}</p>}
        {props.review &&
          props.review.map((review) => (
            <div key={review.name}>
              <p className={`${position.subtext} ${design.subtext}`}>
                {review.name}
              </p>
              <p className={position.text}>{review.review}</p>
            </div>
          ))}
      </div>
    </>
  );
}
