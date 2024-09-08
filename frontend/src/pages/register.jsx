import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/input";
import Button from "../components/button";
import SelectCountry from "../components/selectCountry";
import SelectState from "../components/selectState";
import Logo from "../icons/logo";
import { validate } from "../helper";
import { createUser, getUser } from "../server";

function Register() {
  const [data, setData] = useState({
    email: "",
    fname: "",
    lname: "",
    phone: "",
    building: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    password: "",
  });
  const [err, setErr] = useState({
    email: "",
    fname: "",
    lname: "",
    phone: "",
    country: "",
    state: "",
    city: "",
    password: "",
  });
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
            navigate("/login");
          } else {
            setShow("register");
          }
        });
      }
    } else if (location === "register") {
      Object.entries(data).forEach(([name, value]) => {
        if (name !== "email") {
          const { error, errMessage } = validate(name, value);
          errr = { ...errr, [name]: error ? errMessage : "" };
          setErr((prev) => ({ ...prev, [name]: error ? errMessage : "" }));
        }
      });
      if (
        !errr.fname &&
        !errr.lname &&
        !errr.phone &&
        !errr.country &&
        !errr.state &&
        !errr.city &&
        !errr.password
      ) {
        createUser(
          {
            email: data.email,
            fname: data.fname,
            lname: data.lname,
            phone: data.phone,
            address: {
              building: data.building,
              city: data.city,
              state: data.state,
              country: data.country,
              pincode: data.pincode,
            },
            password: data.password,
          },
          (data) => {
            if (data) {
              sessionStorage.setItem("user", JSON.stringify(data));
              navigate("/login");
            } else {
              navigate(0);
            }
          },
        );
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
      {show === "register" && (
        <FormBig
          heading="We're excited to have you with us."
          onClick={() => onClick("register")}
          buttonText="Create Account"
          data={data}
          err={err}
          onChange={onChange}
        />
      )}
    </>
  );
}

export default Register;

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

function FormBig(props) {
  const [country, setCountry] = useState(null);
  const position = {
    container: "flex flex-col gap-5 w-4/6 md:w-3/6 lg:w-3/6 m-auto py-20",
    heading: "mb-3",
    inputWrapper: "flex gap-2 justify-between",
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
      <div className={position.inputWrapper}>
        <Input
          name="fname"
          value={props.data.fName}
          placeholder="First Name*"
          onChange={props.onChange}
          errName={props.err.fname}
        />
        <Input
          name="lname"
          value={props.data.lname}
          placeholder="Last Name*"
          onChange={props.onChange}
          errName={props.err.lname}
        />
      </div>
      <Input
        name="phone"
        value={props.data.phone}
        placeholder="Phone*"
        onChange={props.onChange}
        errName={props.err.phone}
      />
      <SelectCountry
        name="country"
        value={props.data.country}
        onChange={props.onChange}
        placeholder="Country/Region*"
        setCountry={setCountry}
        errName={props.err.country}
      />
      <SelectState
        name="state"
        value={props.data.state}
        onChange={props.onChange}
        placeholder="State*"
        country={country}
        errName={props.err.state}
      />
      <Input
        name="city"
        placeholder="Town/City*"
        value={props.data.city}
        onChange={props.onChange}
        errName={props.err.city}
      />
      <Input
        name="pincode"
        placeholder="Postcode*"
        value={props.data.pincode}
        onChange={props.onChange}
        errName={props.err.pincode}
      />
      <Input
        name="password"
        type="password"
        value={props.data.password}
        placeholder="Password*"
        onChange={props.onChange}
        errName={props.err.password}
        onKeyDown={(e) => (e.key === "Enter" ? props.onClick() : "")}
      />
      <div className={position.button}>
        <Button text={props.buttonText} onClick={props.onClick} />
      </div>
    </div>
  );
}
