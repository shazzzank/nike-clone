import { useState, useEffect } from "react";
import Card from "./card";
import LArrowIcon from "../icons/larrow";
import RArrowIcon from "../icons/rarrow";
import { getProducts } from "../server";

function Slider(props) {
  const [products, setProducts] = useState([]);
  const [start, setStart] = useState(false);
  const [end, setEnd] = useState(true);
  const position = "flex gap-2 my-5";
  const design = "overflow-x-scroll";

  useEffect(() => {
    getProducts({}, setProducts);
  }, []);

  function handleScroll(e) {
    setStart(e.target.scrollLeft !== 0);
    setEnd(e.target.scrollLeft + e.target.clientWidth !== e.target.scrollWidth);
  }

  return (
    <>
      <Topbar
        heading={props.heading}
        subheading={props.subheading}
        start={start}
        end={end}
      />
      <div
        onScroll={(e) => handleScroll(e)}
        className={`scrollbar ${position} ${design}`}
      >
        {products &&
          products.map((product) => (
            <Card key={product._id} product={product} />
          ))}
      </div>
    </>
  );
}

export default Slider;

// Sub-component

function Topbar(props) {
  const position = {
    container: "flex justify-between mt-10 items-center px-2",
    buttonwrapper: "flex items-center gap-3",
    larrow: "p-2.5",
    rarrow: "p-2.5",
  };
  const design = {
    heading: "text-2xl",
    larrow: "bg-gray-100 rounded-3xl",
    larrowactive: props.start
      ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
      : "text-gray-300",
    rarrow: "bg-gray-100 rounded-3xl",
    rarrowactive: props.end
      ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
      : "text-gray-300",
  };

  function handleScrollLeft() {
    const target = document.querySelector(".scrollbar");
    target.scrollTo({
      left: target.scrollLeft - target.clientWidth,
      behavior: "smooth",
    });
  }

  function handleScrollRight() {
    const target = document.querySelector(".scrollbar");
    target.scrollTo({
      left: target.scrollLeft + target.clientWidth,
      behavior: "smooth",
    });
  }

  return (
    <div className={position.container}>
      <h3 className={design.heading}>{props.heading}</h3>
      <div className={position.buttonwrapper}>
        <h3>{props.subheading}</h3>
        <div
          className={`${position.larrow} ${design.larrow} ${design.larrowactive}`}
          onClick={() => handleScrollLeft()}
        >
          <LArrowIcon />
        </div>
        <div
          className={`${position.rarrow} ${design.rarrow} ${design.rarrowactive}`}
          onClick={() => handleScrollRight()}
        >
          <RArrowIcon />
        </div>
      </div>
    </div>
  );
}
