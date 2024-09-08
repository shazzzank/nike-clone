import { useEffect, useRef } from "react";

function Modal(props) {
  const position = {
    container: "fixed inset-0 flex items-center justify-center",
    wrapper: "p-6 w-11/12 max-w-md mx-auto",
  };
  const design = {
    container: "bg-black bg-opacity-50",
    wrapper: "bg-white rounded-md",
  };
  const ref = useRef();

  useEffect(() => {
    if (props.boolean) {
      document.addEventListener("mousedown", (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
          props.setBoolean(false);
        }
      });
    }
  }, [props]);
  return (
    <div className={`${position.container} ${design.container}`}>
      <div ref={ref} className={`${position.wrapper} ${design.wrapper}`}>
        {props.children}
      </div>
    </div>
  );
}

export default Modal;
