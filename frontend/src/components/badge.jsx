function Badge(props) {
  const position = {
    container: "relative",
    item: "absolute top-0 -right-2",
  };
  const design = {
    item: "text-xs bg-gray-200 rounded-3xl px-1.5 py-0.5",
  };
  return (
    <div className={`${position.container} ${props.className}`}>
      {props.component}
      {props.count && (
        <p className={`${position.item} ${design.item}`}>{props.count}</p>
      )}
    </div>
  );
}

export default Badge;
