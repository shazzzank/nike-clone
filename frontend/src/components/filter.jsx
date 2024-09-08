import { useState } from "react";
import Radio from "./radio";

function Filter(props) {
  const position = {
    container: props.boolean ? "hidden" : "w-56",
  };
  const design = {
    hr: "h-px bg-gray-200 w-2/3 my-4",
  };

  return (
    <div className={position.container}>
      <Price
        items={["0-1000", "1000-2000", "2000-3000"]}
        onChange={props.onChange}
      />
      <hr className={design.hr} />
      <Discount items={["0-10", "10-20", "20-30"]} onChange={props.onChange} />
      <hr className={design.hr} />
      <Color
        items={["green", "blue", "red", "yellow", "gray"]}
        onClick={props.onClick}
      />
      <hr className={design.hr} />
      <Size items={["5", "6", "7", "8"]} onClick={props.onClick} />
    </div>
  );
}

export default Filter;

// Sub-components

function Price(props) {
  const position = {
    heading: "pb-3",
  };
  const design = {
    heading: "font-medium",
    text: "text-sm",
  };
  const options = props.items.map((item) => {
    const [start, end] = item.split("-");
    return `$${start} - $${end}`;
  });

  return (
    <div>
      <h4 className={`${position.heading} ${design.heading}`}>Price</h4>
      <Radio
        className={design.text}
        name="price"
        onChange={props.onChange}
        options={options}
      />
    </div>
  );
}

function Discount(props) {
  const position = {
    heading: "pb-3",
  };
  const design = {
    heading: "font-medium",
    text: "text-sm",
  };
  const options = props.items.map((item) => {
    const [start, end] = item.split("-");
    return `${start}% - ${end}%`;
  });

  return (
    <div>
      <h4 className={`${position.heading} ${design.heading}`}>Discount</h4>
      <Radio
        className={design.text}
        name="discount"
        onChange={props.onChange}
        options={options}
      />
    </div>
  );
}

function Color(props) {
  const [color, setColor] = useState(null);
  const position = {
    heading: "pb-3",
    itemwrapper: "grid grid-cols-3 gap-2 w-2/3 pb-4 *:w-6 *:h-6",
  };
  const design = {
    heading: "font-medium",
    item: "border hover:border-gray-900 rounded-2xl cursor-pointer",
  };

  return (
    <div>
      <h4 className={`${position.heading} ${design.heading}`}>Color</h4>
      <div className={position.itemwrapper}>
        {props.items.map((item) => (
          <input
            key={item}
            onClick={() => {
              props.onClick("color", item);
              setColor(item);
            }}
            className={`${design.item} bg-${item}-400 text-${item}-400 ${
              color === item && "border-gray-900"
            }`}
            readOnly
          />
        ))}
      </div>
    </div>
  );
}

function Size(props) {
  const [size, setSize] = useState(null);
  const position = {
    heading: "pb-3",
    itemwrapper: "grid grid-cols-2 w-2/3 gap-2 *:w-10 *:h-9",
  };
  const design = {
    heading: "font-medium",
    item: "border border-gray-300 text-center rounded-xl cursor-pointer hover:border-gray-900",
  };

  return (
    <div>
      <h4 className={`${position.heading} ${design.heading}`}>Size</h4>
      <div className={position.itemwrapper}>
        {props.items.map((item) => (
          <input
            key={item}
            onClick={() => {
              props.onClick("size", item);
              setSize(item);
            }}
            className={`${design.item} ${size === item && "border-gray-900"}`}
            value={item}
            readOnly
          />
        ))}
      </div>
    </div>
  );
}
