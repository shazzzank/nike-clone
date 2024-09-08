import { useState } from "react";
import axios from "axios";
import App from "./app";
import { Link } from "react-router-dom";

function Home() {
  const session = sessionStorage.getItem("products");
  var [products, setProducts] = useState(session ? JSON.parse(session) : []);
  if (!session) {
    axios.get("/products").then(function (res) {
      sessionStorage.setItem("products", JSON.stringify(res.data));
      setProducts(res.data);
    });
  }
  return (
    <App>
      <div className="banner">
        <div className="banner-content">
          <h1>Stride in Style</h1>
          <hr />
          <p>
            Elevate your every step with premium comfort and timeless style.
            Explore now!
          </p>
          <Link to="#">Shop Now</Link>
        </div>
        <div className="banner-image">
          <img
            src="https://my-unique-ecommerce-v2.s3.eu-north-1.amazonaws.com/shoes/banner-2.png"
            alt="banner"
          />
        </div>
      </div>
      <main>
        <div className="slider">
          <h3>Trending Styles</h3>
          <ul className="slider-tabs">
            <li>Men</li>
            <li>Women</li>
            <li>Kids</li>
          </ul>
          <div className="slider-cards">
            {products &&
              products.map((product) => (
                <div key={product._id} className="slider-card">
                  <div className="slider-card-image">
                    <img src={product.image} alt={product.name} />
                  </div>
                  <div className="slider-card-content">
                    <div>
                      <p>{product.name}</p>
                      <p>${product.price}</p>
                    </div>
                    <p>{product.category}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </main>
      <main></main>
    </App>
  );
}

export default Home;
