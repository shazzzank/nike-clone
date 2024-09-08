import { useEffect, useState } from "react";
import Layout from "../components/layout/layout";
import Slider from "../components/slider";
import Grid from "../components/grid";
import { getProducts, getFavorites } from "../server";

function Favorite() {
  const position = {
    container: "w-11/12 m-auto",
    wrapper: "px-2 *:my-5",
  };
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user")) || null;
    const favs = JSON.parse(sessionStorage.getItem("favorite")) || [];

    if (user) {
      getFavorites({ user: user._id }, setFavorites);
    } else if (favs?.length > 0) {
      setFavorites(favs);
    } else {
      setFavorites([]);
    }

    getProducts({}, setProducts);
  }, []);

  return (
    <Layout>
      <div className={position.container}>
        <div className={position.wrapper}>
          <Heading>Favorites</Heading>
          <Grid products={favorites} />
        </div>
        <Slider products={products} heading="Discover Your Next Favorite" />
      </div>
    </Layout>
  );
}

function Heading(props) {
  const design = "font-medium text-2xl";
  return <h1 className={design}>{props.children}</h1>;
}

export default Favorite;
