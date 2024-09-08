import { useEffect, useState } from "react";
import { getProducts } from "../server";
import Layout from "../components/layout/layout";
import Grid from "../components/grid";
import Dropdown from "../components/dropdown";
import Filter from "../components/filter";
import FilterIcon from "../icons/filter";

function Collection(props) {
  const [products, setProducts] = useState([]);
  const [boolean, setBoolean] = useState(true);
  const position = { container: "flex gap-2" };

  useEffect(() => {
    getProducts({ category: props.category }, setProducts);
  }, [props.category]);

  function sort(e) {
    switch (e.target.textContent) {
      case "Newest":
        setProducts(
          [...products].sort(
            (a, b) => new Date(b.created) - new Date(a.created),
          ),
        );
        break;
      case "Price: High to Low":
        setProducts([...products].sort((a, b) => b.price - a.price));
        break;
      case "Price: Low to High":
        setProducts([...products].sort((a, b) => a.price - b.price));
        break;
      default:
        break;
    }
  }

  function onChange(e) {
    const { name, value } = e.target;
    switch (name) {
      case "price":
        const [minprice, maxprice] = value.split("-");
        getProducts(
          {
            minprice: minprice.replace("$", ""),
            maxprice: maxprice.replace("$", ""),
          },
          setProducts,
        );
        break;
      case "discount":
        const [mindiscount, maxdiscount] = value.split("-");
        getProducts(
          {
            mindiscount: mindiscount.replace("%", ""),
            maxdiscount: maxdiscount.replace("%", ""),
          },
          setProducts,
        );
        break;
      default:
        break;
    }
  }
  function onClick(name, value) {
    getProducts({ [name]: value }, setProducts);
  }

  return (
    <Layout>
      <Topbar
        products={products}
        category={props.category}
        onClick={sort}
        boolean={boolean}
        setBoolean={setBoolean}
      />
      <div className={position.container}>
        <Filter onChange={onChange} onClick={onClick} boolean={boolean} />
        <Grid products={products} />
      </div>
    </Layout>
  );
}

function Topbar(props) {
  const position = {
    container: "flex justify-between py-5",
    wrapper: "flex gap-5 *:flex *:gap-2",
  };
  const design = {
    heading: "font-medium text-2xl",
    text: "font-light tracking-wide cursor-pointer",
  };

  return (
    <div className={position.container}>
      <h1 className={design.heading}>
        {props.category} Shoes ({props.products.length})
      </h1>
      <div className={position.wrapper}>
        <div onClick={() => props.setBoolean(!props.boolean)}>
          <span className={design.text}>Filters</span>
          <FilterIcon />
        </div>
        <Dropdown
          heading="Sort"
          text={["Newest", "Price: High to Low", "Price: Low to High"]}
          onClick={props.onClick}
          className={design.text}
        />
      </div>
    </div>
  );
}

export default Collection;
