import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/layout";
import Slider from "../components/slider";
import Button from "../components/button";
import { getProduct, getProducts } from "../server";

function Home() {
  const [product, setProduct] = useState({});
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const position = {
    container: "text-center",
    heading: "mt-8",
    imagewrapper: "h-3/6",
    image: "scale-150",
    text: "m-auto w-2/4 mt-3 mb-6",
  };
  const design = {
    heading: "futura text-5xl uppercase tracking-tighter",
    imagewrapper: "overflow-hidden",
    image: "object-cover",
    text: "text-lg",
  };

  useEffect(() => {
    getProduct({ slug: "phoenix-flyers" }, setProduct);
    getProducts({}, setProducts);
  }, []);

  return (
    <Layout>
      {product && (
        <div className={position.container}>
          <div className={`${position.imagewrapper} ${design.imagewrapper}`}>
            <img
              className={`${position.image} ${design.image}`}
              src={product.image}
              alt={product.slug}
            />
          </div>
          <h1 className={`${position.heading} ${design.heading}`}>
            {product.name}
          </h1>
          <p className={`${position.text} ${design.text}`}>
            {product.description}
          </p>
          <Button
            text="Learn More"
            onClick={() => navigate(`/product/${product.slug}`)}
          />
          <Slider products={products} heading="Discover" subheading="Shop" />
        </div>
      )}
    </Layout>
  );
}

export default Home;
