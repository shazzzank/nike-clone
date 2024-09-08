import { useNavigate } from "react-router-dom";
import { getDiscountedPrice } from "../helper";

function Card(props) {
  const navigate = useNavigate();
  const position = {
    container: "min-w-fit text-left",
    image: "h-80 w-80 p-2",
    heading: "pt-2",
    subheading: "py-2",
    textlight: "px-2",
  };
  const design = {
    image: "bg-gray-100 object-contain border border-transparent rounded-lg",
    heading: "font-medium",
    subheading: "font-medium",
    text: "text-gray-500",
    textlight: "text-gray-300 line-through",
  };

  return (
    <>
      {props.product && (
        <div
          className={position.container}
          onClick={() =>
            props.onClick
              ? props.onClick(props.product)
              : navigate("/product/" + props.product.slug)
          }
        >
          <img
            className={`${position.image} ${design.image}`}
            src={props.product.image}
            alt={props.product.name}
          />
          <h3 className={`${position.heading} ${design.heading}`}>
            {props.product.name}
          </h3>
          <h3 className={design.text}>{props.product.category} Shoes</h3>
          <h3 className={`${position.subheading} ${design.subheading}`}>
            ${getDiscountedPrice(props.product.price, props.product.discount)}
            <span className={`${position.textlight} ${design.textlight}`}>
              ${props.product.price}
            </span>
          </h3>
        </div>
      )}
    </>
  );
}

export default Card;
