function Picture(props) {
  const position = {
    container: "flex justify-center items-center w-28 h-28",
  };
  const design = { container: "bg-gray-200 rounded-full" };

  return (
    <div className={`${position.container} ${design.container}`}>
      {props.image ? <img src={props.image} alt="profile" /> : props.icon}
    </div>
  );
}

export default Picture;
