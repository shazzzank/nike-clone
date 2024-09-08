import HeartIcon from "../icons/heart";

function Button(props) {
  const position = {
    item: "py-1.5 px-5",
    condition: props.light ? "flex gap-2 justify-center" : "",
  };
  const design = {
    item: "border border-gray-400 rounded-full",
    condition: props.light
      ? "bg-white text-gray-800"
      : "bg-gray-900 text-white",
  };

  return (
    <button
      className={`${position.item} ${position.condition} ${design.item} ${design.condition}`}
      onClick={props.onClick}
    >
      {props.text}
      {props.icon && <HeartIcon />}
    </button>
  );
}

export default Button;
