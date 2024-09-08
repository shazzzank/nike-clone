import RotateIcon from "../icons/rotate";
import Clock from "../icons/clock";
import TruckIcon from "../icons/truck";
import PaperplaneIcon from "../icons/paperplane";
import CashIcon from "../icons/cash";
import CheckcircleIcon from "../icons/checkcircle";
import HouseIcon from "../icons/house";

function Progressbar(props) {
  const position = {
    container: "mx-auto my-10",
    empty: "overflow-hidden",
    filled: "h-2",
    wrapper: "grid grid-cols-5 mt-4 gap-4",
    itemWrapper: "flex flex-wrap",
    item: "hidden sm:inline",
  };
  const design = {
    empty: "bg-gray-200 rounded-full",
    filled: "bg-green-500 rounded-full",
    wrapper: "text-sm font-medium text-gray-400",
    itemWrapper: props.role === "admin" ? "cursor-pointer" : "",
  };
  const index = props.items.lastIndexOf(props.index);
  const width = `${(index / (props.items.length - 1)) * 100}%`;

  function displayIcon(item) {
    switch (item) {
      case "Return Placed":
        return <RotateIcon />;
      case "Processing":
        return <Clock />;
      case "Preparing to Ship":
      case "Preparing to Pickup":
        return <TruckIcon />;
      case "Shipped":
        return <PaperplaneIcon />;
      case "Refunded":
        return <CashIcon />;
      case "Order Placed":
        return <CheckcircleIcon />;
      case "Delivered":
        return <HouseIcon />;
      default:
        return item;
    }
  }

  return (
    <div className={position.container}>
      <div className={`${position.empty} ${design.empty}`}>
        <div
          className={`${position.filled} ${design.filled}`}
          style={{ width: width }}
        ></div>
      </div>
      <ol className={`${position.wrapper} ${design.wrapper}`}>
        {props.items.map((item, i) => (
          <li
            key={i}
            className={`${position.itemWrapper} ${design.itemWrapper} ${
              i <= index ? "text-green-600" : ""
            } ${
              i === 0
                ? "flex-start"
                : i + 1 === props.items.length
                ? "justify-end"
                : "justify-center"
            }`}
            onClick={() =>
              props.role === "admin" ? props.onClick(item) : null
            }
          >
            {displayIcon(item)}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default Progressbar;
