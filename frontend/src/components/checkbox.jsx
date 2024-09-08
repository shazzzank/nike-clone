function Checkbox(props) {
  const position = {
    itemwrapper: "flex gap-2 items-center pb-2",
    item: "w-5 h-4",
  };
  const design = { item: "accent-black" };
  return (
    <>
      {props.options.map((item) => {
        return (
          <label key={item} className={position.itemwrapper}>
            <input
              className={`${position.item} ${design.item}`}
              type="checkbox"
              name={props.name}
              value={item}
              onChange={props.onChange}
              checked={props.checked.includes(item)}
            />
            <span className={props.className}>{item}</span>
          </label>
        );
      })}
    </>
  );
}

export default Checkbox;
