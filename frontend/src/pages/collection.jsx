import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../layout";
import Filter from "../components/filter";
import Arrow from "../icons/arrow";

function Collection(props) {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ category: props.category });
  const [boolean, setBoolean] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setFilters({ category: props.category }); 
  }, [props.category]);

  useEffect(
    () => {
      axios
        .post("https://nike-clone-gamma-snowy.vercel.app/products", filters)
        .then((res) => setProducts(res.data))
        .catch((err) => console.log(err));
    },
    [filters],
  );

  function sort(by) {
    switch (by) {
      case "Newest":
        setProducts(
          [...products].sort(
            (a, b) => new Date(b.created) - new Date(a.created),
          ),
        );
        break;
      case "Price: Low-High":
        setProducts([...products].sort((a, b) => a.price - b.price));
        break;
      case "Price: High-Low":
        setProducts([...products].sort((a, b) => b.price - a.price));
        break;
      default:
        break;
    }
    setBoolean(!boolean);
  }

  return (
    <Layout>
      <div className="w-11/12 pt-20 m-auto pb-40">
        <div className="flex justify-between">
          <h2 className="font-medium text-2xl">
            {props.category} Shoes (
            {products.length > 0 ? products.length : "0"})
          </h2>
          <div className="text-right">
            <h3 className="flex gap-1" onClick={(_) => setBoolean(!boolean)}>
              Sort By
              <Arrow boolean={boolean} />
            </h3>
            <div className="relative">
              <div
                className={`absolute right-0 w-36 bg-white border border-white rounded-2xl p-3 *:pt-1 ${
                  boolean ? "visible" : "invisible"
                }`}
              >
                {["Newest", "Price: High-Low", "Price: Low-High"].map(
                  (option, index) => (
                    <p
                      key={index}
                      className="hover:cursor-pointer hover:text-gray-400"
                      onClick={() => sort(option)}
                    >
                      {option}
                    </p>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between pt-4 m-auto">
          <div className="w-1/4 md:w-1/5 lg:w-2/12">
            <div className="sticky top-0">
              <Filter category={props.category} setFilters={setFilters} />
            </div>
          </div>
          <div className="w-8/12 md:w-9/12 lg:w-4/5">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {products.length > 0 ? (
                products.map((product) => (
                  <div
                    key={product._id}
                    onClick={() => navigate(`/product/${product.slug}`)}
                    className="flex flex-col text-sm sm:text-base mt-5"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full px-5 h-64 object-contain mb-2 bg-gray-100 border border-transparent rounded-lg"
                    />
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-gray-500">{product.category} Shoes</p>
                    {product.colors.length && (
                      <p className="text-gray-500">
                        {`${product.colors.length} ${
                          product.colors.length > 1 ? "Colors" : "Color"
                        }`}
                      </p>
                    )}
                    <p className="font-medium text-gray-900 mt-1">
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
                            ${product.price.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span>${product.price.toFixed(2)}</span>
                      )}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No products found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Collection;
