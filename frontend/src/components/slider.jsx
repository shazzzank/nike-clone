import { useState, useEffect } from "react";
import LArrowIcon from "../icons/larrow";
import RArrowIcon from "../icons/rarrow";

function Slider({ products, heading, subheading }) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isScrollStart, setIsScrollStart] = useState(true);
  const [isScrollEnd, setIsScrollEnd] = useState(false);

  useEffect(() => {
    const container = document.querySelector(".hide-scrollbar");
    const handleScroll = () => {
      const newPosition = container.scrollLeft;
      setScrollPosition(newPosition);
      setIsScrollStart(newPosition === 0);
      setIsScrollEnd(
        newPosition + container.clientWidth === container.scrollWidth,
      );
    };
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const scroll = (scrollOffset) => {
    const container = document.querySelector(".hide-scrollbar");
    container.scrollTo({
      left: Math.max(scrollPosition + scrollOffset, 0),
      behavior: "smooth",
    });
  };

  return (
    <>
      <div className="flex items-center justify-between mt-5">
        <p className="text-2xl">{heading}</p>
        <div className="flex items-center space-x-3">
          <p>{subheading}</p>
          <button
            className={`rounded-3xl p-2.5 ${
              isScrollStart
                ? "bg-gray-100 text-gray-300"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => scroll(-500)}
          >
            <LArrowIcon />
          </button>
          <button
            className={`rounded-3xl p-2.5 ${
              isScrollEnd
                ? "bg-gray-100 text-gray-300"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => scroll(500)}
          >
            <RArrowIcon />
          </button>
        </div>
      </div>
      <div className="flex gap-2 hide-scrollbar overflow-x-scroll my-5">
        {products &&
          products.map((product) => (
            <a
              key={product._id}
              className="flex-shrink-0"
              style={{ width: "30vw" }}
              href={`/product/${product.slug}`}
            >
              <div className="flex flex-col">
                <img
                  key={product._id}
                  className="bg-gray-100 px-5 object-contain w-full border border-transparent rounded-lg"
                  style={{ height: "45vh" }}
                  src={product.image}
                  alt={product.name}
                />
                <p className="font-medium mt-2 text-gray-900">{product.name}</p>
                <p className="text-gray-500">{product.category} Shoes</p>
                <p className="font-medium mt-2 text-gray-900">
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
                        {"$" + product.price.toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <span>{"$" + product.price.toFixed(2)}</span>
                  )}
                </p>
              </div>
            </a>
          ))}
      </div>
    </>
  );
}

export default Slider;
