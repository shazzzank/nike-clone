import LarrowIcon from "../icons/larrow";

function Backbutton(props) {
  const design = "cursor-pointer";
  return (
    <LarrowIcon
      className={design}
      onClick={() => props.setBoolean(!props.boolean)}
    />
  );
}

export default Backbutton;
