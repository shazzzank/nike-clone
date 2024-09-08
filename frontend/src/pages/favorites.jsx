import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../layout";
import Slider from "../components/slider";

function Favorites() {
  const favorites = JSON.parse(sessionStorage.getItem("favorites")) || [];
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .post("https://nike-clone-gamma-snowy.vercel.app/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <Layout>
      <div className="w-10/12 py-10 m-auto">
        <h2 className="font-medium text-2xl text-gray-700 mb-5">Favorites</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 pt-8 pb-10">
          {favorites.length ? (
            favorites.map((product) => (
              <div
                key={product._id}
                onClick={() => navigate(`/product/${product.slug}`)}
                className="flex flex-col text-sm sm:text-base mt-5 cursor-pointer"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full px-5 h-64 object-contain mb-2 bg-gray-100 border border-transparent rounded-lg"
                />
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-gray-500">{product.category} Shoes</p>
                  </div>
                  <p className="font-medium text-gray-900 mt-1">
                    {product.discount && product.discount > 0 ? (
                      <div class="flex flex-col">
                        <span>
                          {"$" +
                            (
                              product.price -
                              (product.price * product.discount) / 100
                            ).toFixed(2)}
                        </span>
                        <span className="text-gray-300 line-through">
                          ${product.price?.toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      <span>${product.price?.toFixed(2)}</span>
                    )}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="font-medium">
              You can find items you've favorited saved here.
            </p>
          )}
        </div>
        <Slider products={products} heading="Discover Your Next Favorites" />
      </div>
    </Layout>
  );
}

export default Favorites;
