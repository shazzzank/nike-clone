import Card from "./card";
import Cardbig from "./cardbig";
import { shippingDate } from "../helper";

function Grid(props) {
  const position = {
    container:
      "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 w-full",
    orderContainer: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6",
  };
  const design = {
    text: "text-gray-400",
  };

  if (props.products?.length) {
    return (
      <div className={position.container}>
        {props.products.map((item) => (
          <Card key={item._id} product={item} onClick={props.onClick} />
        ))}
      </div>
    );
  } else if (props.orders) {
    return (
      <div className={position.orderContainer}>
        {props.orders.map((order) =>
          order.cart.map((item) => (
            <Cardbig
              key={item._id}
              product={item.product}
              cart={item}
              badge={
                order.shipping.status === "Refunded"
                  ? order.shipping.status
                  : order.shipping.history.some(
                      (entry) => entry.status === "Return Placed",
                    )
                  ? "Pickup by " + shippingDate(order.shipping.date)
                  : order.shipping.status === "Delivered"
                  ? order.shipping.status
                  : "Delivery by " + shippingDate(order.shipping.date)
              }
              onClick={() => props.onClick({ order, product: item })}
            />
          )),
        )}
      </div>
    );
  } else {
    return <p className={design.text}>No data found</p>;
  }
}

export default Grid;
