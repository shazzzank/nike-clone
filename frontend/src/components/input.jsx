import { useState } from "react";
import Eye from "../icons/eye";
import EyeClosed from "../icons/eyeclosed";

function Input(props) {
  const [boolean, setBoolean] = useState(false);
  const position = {
    container: "flex flex-col w-full",
    wrapper: "flex justify-between w-full p-4 my-2",
    item: "w-11/12",
  };
  const design = {
    wrapper: "border border-gray-300 rounded-md hover:border-gray-700",
    item: "outline-none",
    text: "text-sm text-red-500",
    icon: "cursor-pointer",
  };

  return (
    <div className={position.container}>
      <div className={`${position.wrapper} ${design.wrapper}`}>
        <input
          className={`${position.item} ${design.item}`}
          name={props.name}
          value={props.value}
          type={
            props.type === "password" ? (boolean ? "text" : "password") : "text"
          }
          placeholder={props.placeholder}
          onChange={props.onChange}
          onKeyDown={props.onKeyDown}
        />
        {props.type === "password" && (
          <div className={design.icon} onClick={() => setBoolean(!boolean)}>
            {boolean ? <EyeClosed /> : <Eye />}
          </div>
        )}
      </div>
      {props.errName && <p className={design.text}>{props.errName}</p>}
    </div>
  );
}

export default Input;
