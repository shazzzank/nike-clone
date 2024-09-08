import React from "react";
import Checkbox from "./checkbox";
import DarrowIcon from "../icons/darrow";

function Multiselect(props) {
  const position = {
    container: "relative w-full p-4 my-2",
    mainWrapper: "flex justify-between",
    wrapper: "absolute right-0 mt-2 z-10 pt-4 px-4 w-full",
    item: "py-2 px-4",
  };
  const design = {
    container:
      "border border-gray-300 rounded-md hover:border-gray-700 cursor-pointer",
    wrapper:
      "bg-white shadow-md rounded-b-md border border-gray-300 border-t-0 ",
    item: "text-sm rounded-md hover:bg-gray-50",
  };

  return (
    <details className={`${position.container} ${design.container}`}>
      <summary className={position.mainWrapper}>
        <h3>{props.placeholder}</h3>
        <DarrowIcon />
      </summary>
      <div className={`${position.wrapper} ${design.wrapper}`}>
        <Checkbox
          name={props.name}
          options={props.options}
          onChange={props.onChange}
          checked={props.checked}
        />
      </div>
    </details>
  );
}

export default Multiselect;
