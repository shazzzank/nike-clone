import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../layout";
import Slider from "../components/slider";

function Home() {
  const [banner, setBanner] = useState([]);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .post("https://nike-clone-gamma-snowy.vercel.app/product", { slug: "phoenix-flyers" })
      .then((res) => setBanner(res.data))
      .catch((err) => console.log(err));
    axios
      .post("https://nike-clone-gamma-snowy.vercel.app/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  }, []);
  return (
    <Layout>
      <div className="p-6">
        {banner &&
          banner.map((product) => (
            <div key={product._id} className="text-center">
              <div className="overflow-hidden h-3/6">
                <img
                  className="object-cover scale-150"
                  src={product.image}
                  alt="banner"
                />
              </div>
              <h2 className="text-5xl font-two uppercase tracking-tighter pt-8">
                {product.name}
              </h2>
              <p className="text-lg w-2/4 m-auto pt-3 pb-6">
                {product.description}
              </p>
              <button
                className="bg-gray-900 py-1.5 px-5 rounded-3xl text-white"
                onClick={() => navigate("/product/phoenix-flyers")}
              >
                Learn More
              </button>
            </div>
          ))}
        <Slider products={products} heading="Discover" subheading="Shop" />
      </div>
    </Layout>
  );
}

export default Home;
