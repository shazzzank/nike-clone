import React from "react";
import DarrowIcon from "../icons/darrow";

function Select(props) {
  const position = {
    container: "flex flex-col w-full",
    wrapper: "flex justify-between w-full *:p-4 my-2",
    item: "w-11/12",
  };
  const design = {
    wrapper:
      "border border-gray-300 rounded-md hover:border-gray-700 cursor-pointer",
    text: "text-sm text-red-500",
    item: `${
      props.value === "" ? "text-gray-400" : ""
    } outline-none appearance-none bg-transparent`,
  };
  const selectRef = React.useRef(null);

  return (
    <div className={position.container}>
      <div className={`${position.wrapper} ${design.wrapper}`}>
        <select
          ref={selectRef}
          name={props.name}
          value={props.value}
          className={`${position.item} ${design.item}`}
          onChange={props.onChange}
        >
          <option value="">{props.placeholder}</option>
          {props.options.map((item) => (
            <option key={item.value} value={item.value}>
              {item.name}
            </option>
          ))}
        </select>
        <div
          onClick={() =>
            selectRef.current?.dispatchEvent(new MouseEvent("mousedown"))
          }
        >
          <DarrowIcon />
        </div>
      </div>
      {props.errName && <p className={design.text}>{props.errName}</p>}
    </div>
  );
}

export default Select;
