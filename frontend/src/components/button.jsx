function Button(props) {
  const color =
    props.type === "white" ? "text-gray-800" : "bg-gray-800 text-white";
  return (
    <button
      className={`flex gap-1 justify-center w-full border border-gray-700 rounded-3xl py-3 font-medium mt-3 ${color}`}
      onClick={props.onClick}
    >
      {props.text}
      {props.icon && <props.icon />}
    </button>
  );
}

export default Button;
