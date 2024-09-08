function Textarea(props) {
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
        <textarea
          className={`${position.item} ${design.item}`}
          name={props.name}
          value={props.value}
          placeholder={props.placeholder}
          onChange={props.onChange}
          onKeyDown={props.onKeyDown}
        />
      </div>
      {props.errName && <p className={design.text}>{props.errName}</p>}
    </div>
  );
}

export default Textarea;
