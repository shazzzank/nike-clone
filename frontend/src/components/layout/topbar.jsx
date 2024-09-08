import { useNavigate } from "react-router-dom";
import Dropdown from "../dropdown";

function Topbar() {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user")) || {};
  const position = {
    container: "flex justify-end px-5 py-1",
    icon: "w-5 h-5",
    wrapper: "flex gap-3 items-center",
  };
  const design = {
    container: "bg-gray-200",
    text: "text-xs font-medium tracking-wide cursor-pointer",
  };

  function onClick(e) {
    switch (e.target.innerHTML) {
      case "Dashboard":
        navigate(`/dashboard/${user.role}`);
        break;
      case "Logout":
        sessionStorage.removeItem("user");
        navigate("/");
        break;
      default:
        break;
    }
  }

  return (
    <div className={`${position.container} ${design.container}`}>
      {Object.keys(user).length ? (
        <Dropdown
          heading={`Hi, ${user.fname}`}
          text={["Dashboard", "Logout"]}
          onClick={onClick}
          className={design.text}
          iconClassName={position.icon}
        />
      ) : (
        <div className={position.wrapper}>
          <p className={design.text} onClick={() => navigate("/register")}>
            Register
          </p>
          <p className={design.text}>|</p>
          <p className={design.text} onClick={() => navigate("/login")}>
            Login
          </p>
        </div>
      )}
    </div>
  );
}

export default Topbar;
