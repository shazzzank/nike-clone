function Topbar(props) {
  const position = {
    container: "flex flex-col gap-10 sm:items-center sm:gap-40 sm:flex-row",
    item: "flex gap-5",
  };
  const design = {
    heading: "text-2xl",
    text: "font-medium cursor-pointer",
  };

  return (
    <div className={position.container}>
      <h3 className={design.heading}>{props.heading}</h3>
      <div className={position.item}>
        {props.items.map((item) => (
          <p
            key={item}
            className={`${design.text} ${
              props.heading === item && "text-gray-500"
            }`}
            onClick={() => props.setHeading(item)}
          >
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}

export default Topbar;
