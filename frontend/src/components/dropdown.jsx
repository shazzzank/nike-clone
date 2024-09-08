import DarrowIcon from "../icons/darrow";

function dropdown(props) {
  const position = {
    container: "relative",
    mainWrapper: "flex gap-2 items-center",
    wrapper: "absolute mt-2 right-0 z-10 w-max",
    item: "py-2 px-4",
  };
  const design = {
    container: "cursor-pointer",
    wrapper: "bg-white rounded-lg shadow-md",
    item: "text-sm rounded-md hover:bg-gray-50",
  };

  return (
    <details className={`${position.container} ${design.container}`}>
      <summary className={position.mainWrapper}>
        <h3 className={props.className}>{props.heading}</h3>
        <DarrowIcon className={props.iconClassName} />
      </summary>
      <div className={`${position.wrapper} ${design.wrapper}`}>
        {props.text.map((item, index) => (
          <p
            key={index}
            className={`${position.item} ${design.item}`}
            onClick={props.onClick}
          >
            {item}
          </p>
        ))}
      </div>
    </details>
  );
}

export default dropdown;
