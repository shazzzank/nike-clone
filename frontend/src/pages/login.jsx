import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/input";
import Button from "../components/button";
import Logo from "../icons/logo";
import { validate } from "../helper";
import { getUser } from "../server";

function Login() {
  const [data, setData] = useState({ email: "", password: "" });
  const [err, setErr] = useState({ email: "", password: "" });
  const [show, setShow] = useState("email");
  const navigate = useNavigate();

  function onChange(e) {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  }

  function onClick(location) {
    let errr = {};
    if (location === "email") {
      Object.entries(data).forEach(([name, value]) => {
        if (name === "email") {
          const { error, errMessage } = validate(name, value);
          errr = { ...errr, [name]: error ? errMessage : "" };
          setErr((prev) => ({ ...prev, [name]: error ? errMessage : "" }));
        }
      });
      if (!errr.email) {
        getUser({ email: data.email }, (res) => {
          if (res) {
            setShow("password");
          } else {
            navigate("/register");
          }
        });
      }
    } else if (location === "password") {
      Object.entries(data).forEach(([name, value]) => {
        if (name === "password") {
          const { error, errMessage } = validate(name, value);
          errr = { ...errr, [name]: error ? errMessage : "" };
          setErr((prev) => ({ ...prev, [name]: error ? errMessage : "" }));
        }
      });
      if (!errr.password) {
        getUser(data, (data) => {
          if (data) {
            sessionStorage.setItem("user", JSON.stringify(data));
            navigate(`/dashboard/${data.role}`);
          } else {
            navigate(0);
          }
        });
      }
    }
  }

  return (
    <>
      {show === "email" && (
        <Form
          heading="Enter your email to join or sign in."
          name="email"
          placeholder="Email"
          data={data.email}
          err={err.email}
          onChange={onChange}
          onClick={() => onClick("email")}
          buttonText="Continue"
        />
      )}
      {show === "password" && (
        <Form
          heading="What's your password?"
          name="password"
          type="password"
          placeholder="Password"
          data={data.password}
          err={err.password}
          onChange={onChange}
          onClick={() => onClick("password")}
          buttonText="Sign in"
        />
      )}
    </>
  );
}

export default Login;

function Form(props) {
  const position = {
    container: "flex flex-col gap-5 w-4/6 md:w-3/6 lg:w-3/6 m-auto py-20",
    heading: "mb-3",
    button: "*:w-full *:p-3",
  };
  const design = {
    heading: "text-3xl text-gray-700",
  };

  return (
    <div className={position.container}>
      <Logo />
      <h1 className={`${position.heading} ${design.heading}`}>
        {props.heading}
      </h1>
      <div>
        <Input
          name={props.name}
          value={props.data}
          placeholder={props.placeholder}
          onChange={props.onChange}
          errName={props.err}
          type={props.type}
          onKeyDown={(e) => (e.key === "Enter" ? props.onClick() : "")}
        />
      </div>
      <div className={position.button}>
        <Button text={props.buttonText} onClick={props.onClick} />
      </div>
    </div>
  );
}
