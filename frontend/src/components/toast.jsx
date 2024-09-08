import { useState, useEffect } from "react";
function Toast(props) {
  const [message, setMessage] = useState("");

  useEffect(
    (_) => {
      setMessage(props.message);
    },
    [props.message],
  );

  return (
    message && (
      <div className="fixed bg-gray-800 text-white rounded-md py-3 px-5 z-10 bottom-4 right-2/3">
        {message}
      </div>
    )
  );
}

export default Toast;
