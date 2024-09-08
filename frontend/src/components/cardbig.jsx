import Button from "./button";

function Cardbig(props) {
  const cart = props.cart;
  const product = props.product;
  const position = {
    container: "flex flex-col gap-4",
    cardContainer: "flex gap-5",
    image: `p-5 ${props.className ? props.className : "w-44 h-44"}`,
    wrapper: "flex flex-col justify-between",
    buttonContainer: "*:my-1 *:w-full *:py-3",
  };
  const design = {
    badge: "text-green-700",
    heading: "font-medium text-lg",
    subheading: "font-light",
    image: "object-contain bg-gray-100 rounded-lg",
    subtext: "font-light text-gray-500",
  };

  return (
    <div onClick={props.onClick} className={position.container}>
      <div className={position.cardContainer}>
        <img
          className={`${position.image} ${design.image}`}
          src={product.image}
          alt={product.name}
        />
        <div className={position.wrapper}>
          <div>
            {props.badge && <p className={design.badge}>{props.badge} </p>}
            <h3 className={design.heading}>{product.name}</h3>
            <p className={design.subheading}>${cart.price}</p>
          </div>
          <div className={design.subtext}>
            <p>{product.category} Shoes</p>
            <p>{cart.color.charAt(0).toUpperCase() + cart.color.slice(1)}</p>
            <p>Size {cart.size}</p>
          </div>
        </div>
      </div>
      <div className={position.buttonContainer}>
        {props.buttons &&
          props.buttons.map((item) => (
            <Button
              key={item.name}
              text={item.name}
              onClick={item.onClick}
              light={item.type ? true : false}
            />
          ))}
      </div>
    </div>
  );
}

export default Cardbig;
