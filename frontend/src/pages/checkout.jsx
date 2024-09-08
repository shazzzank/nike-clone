import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/layout/layout";
import Input from "../components/input";
import Button from "../components/button";
import { getDaysToDate, shippingDaysToDate, validate } from "../helper";
import {
  createOrder,
  createPayment,
  createShipping,
  createUser,
} from "../server";
import SelectState from "../components/selectState";
import SelectCountry from "../components/selectCountry";

function Checkout() {
  const position = {
    container: "w-2/4 m-auto",
    button: "*:w-full *:py-4 mt-5",
    separator: "mt-10 mb-4",
    inputWrapper: "flex gap-4",
  };
  const [data, setData] = useState({
    fname: "",
    lname: "",
    street: "",
    building: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    email: "",
    phone: "",
    date: "",
    payment: "",
    cname: "",
    cnumber: "",
    promo: "",
  });
  const [err, setErr] = useState({
    fname: "",
    lname: "",
    building: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    email: "",
    phone: "",
    cname: "",
    cnumber: "",
  });
  const navigate = useNavigate();
  const { route } = useParams();
  const [country, setCountry] = useState("");
  const [integer, setInteger] = useState(0);
  const [show, setShow] = useState(
    route === "member" ? "shipping" : "delivery",
  );

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user && Object.keys(user).length) {
      setData((prev) => ({
        ...prev,
        fname: user.fname,
        lname: user.lname,
        building: user.address.building,
        city: user.address.city,
        state: user.address.state,
        country: user.address.country,
        pincode: user.address.pincode,
        email: user.email,
        phone: user.phone.toString(),
      }));
    }
  }, []);

  function onChange(e) {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  }

  function onClick() {
    let errr = {};

    Object.entries(data).forEach(([name, value]) => {
      const { error, errMessage } = validate(name, value);
      errr = { ...errr, [name]: error ? errMessage : "" };
      setErr((prev) => ({ ...prev, [name]: error ? errMessage : "" }));
    });
    if (
      !errr.fname &&
      !errr.lname &&
      !errr.building &&
      !errr.city &&
      !errr.state &&
      !errr.country &&
      !errr.pincode &&
      !errr.email &&
      !errr.phone
    ) {
      setShow("shipping");
    }
    if (data.date) {
      setShow("payment");
    }
    if (data.payment === "Cash on Delivery" || (!errr.cname && !errr.cnumber)) {
      const user = JSON.parse(sessionStorage.getItem("user"));
      if (!user) {
        createUser(
          {
            fname: data.fname,
            lname: data.lname,
            address: {
              street: data.street,
              building: data.building,
              city: data.city,
              state: data.state,
              country: data.country,
              pincode: data.pincode,
            },
            email: data.email,
            phone: data.phone,
          },
          (userData) => {
            if (userData) {
              sessionStorage.setItem("user", JSON.stringify(userData));
              createShippingProcess(userData._id);
            }
          },
        );
      } else {
        createShippingProcess(user._id);
      }
    }
  }

  function createShippingProcess(userId) {
    createShipping(
      {
        date: data.date,
        history: { status: "Order Placed" },
        status: "Order Placed",
      },
      (shippingData) => {
        if (shippingData) {
          sessionStorage.setItem("shipping", JSON.stringify(shippingData));
          createPaymentProcess(userId, shippingData._id);
        }
      },
    );
  }

  function createPaymentProcess(userId, shippingId) {
    createPayment(
      {
        promo: data.promo,
        mode: data.payment,
        amount: JSON.parse(sessionStorage.getItem("cart")).reduce(
          (i, item) => i + item.price,
          0,
        ),
      },
      (paymentData) => {
        if (paymentData) {
          sessionStorage.setItem("payment", JSON.stringify(paymentData));
          createOrderProcess(userId, shippingId, paymentData._id);
        }
      },
    );
  }

  function createOrderProcess(userId, shippingId, paymentId) {
    createOrder(
      {
        cart: JSON.parse(sessionStorage.getItem("cart")).map(
          (item) => item._id,
        ),
        user: userId,
        shipping: shippingId,
        payment: paymentId,
      },
      (orderData) => {
        if (orderData) {
          sessionStorage.setItem("order", JSON.stringify(orderData));
          navigate("/success");
        } else {
          navigate(0);
        }
      },
    );
  }

  return (
    <Layout>
      <div className={position.container}>
        <div className={show === "delivery" ? "block" : "hidden"}>
          <Title text="Delivery" />
          <Heading text="What's your name and address?" />
          <Input
            name="fname"
            value={data.fname}
            onChange={onChange}
            placeholder="First Name"
            errName={err.fname}
          />
          <Input
            name="lname"
            value={data.lname}
            onChange={onChange}
            placeholder="Last Name"
            errName={err.lname}
          />
          <Input
            name="street"
            value={data.street}
            onChange={onChange}
            placeholder="Street Address"
          />
          <Input
            name="building"
            value={data.building}
            onChange={onChange}
            placeholder="Apt, Suite, Building"
            errName={err.building}
          />
          <div className={position.inputWrapper}>
            <Input
              name="city"
              value={data.city}
              onChange={onChange}
              placeholder="City"
              errName={err.city}
            />
            <Input
              name="pincode"
              value={data.pincode}
              onChange={onChange}
              placeholder="Pincode"
              errName={err.pincode}
            />
          </div>
          <div className={position.inputWrapper}>
            <SelectState
              name="state"
              value={data.state}
              onChange={onChange}
              placeholder="State"
              country={country}
              errName={err.state}
            />
            <SelectCountry
              name="country"
              value={data.country}
              onChange={onChange}
              placeholder="Country"
              setCountry={setCountry}
              errName={err.country}
            />
          </div>
          <Heading text="What's your contact information?" />
          <Input
            name="email"
            value={data.email}
            onChange={onChange}
            placeholder="Email"
            errName={err.email}
          />
          <Input
            name="phone"
            value={data.phone}
            onChange={onChange}
            placeholder="Phone Number"
            errName={err.phone}
          />
          <div className={position.button}>
            <Button text="Continue" onClick={() => onClick("delivery")} />
          </div>
          <hr className={position.separator} />
        </div>
        <div className={show === "shipping" ? "block" : "hidden"}>
          <Title text="Shipping" />
          <Heading text="When do you want the order?" />
          <Box
            text={`${shippingDaysToDate(4)} - ${shippingDaysToDate(7)}`}
            subtext="Free"
            boolean={integer === 1}
            onClick={() => {
              setData((prev) => ({
                ...prev,
                date: getDaysToDate(7),
              }));
              setInteger(1);
            }}
          />
          <Box
            text={`${shippingDaysToDate(3)} - ${shippingDaysToDate(5)}`}
            subtext="$50"
            boolean={integer === 2}
            onClick={() => {
              setData((prev) => ({
                ...prev,
                date: getDaysToDate(5),
              }));
              setInteger(2);
            }}
          />
          <div className={position.button}>
            <Button text="Continue" onClick={() => onClick("shipping")} />
          </div>
          <hr className={position.separator} />
        </div>
        <div className={show === "payment" ? "block" : "hidden"}>
          <Title text="Payment" />
          <Heading text="Have a promo code?" />
          <Input
            name="promo"
            value={data.promo}
            onChange={onChange}
            placeholder="Promo"
            errName={err.promo}
          />
          <Heading text="How would you like to pay?" />
          <Box
            text="Credit or Debit Card"
            boolean={data.payment === "Credit or Debit Card"}
            onClick={() =>
              setData((prev) => ({ ...prev, payment: "Credit or Debit Card" }))
            }
          />
          <Box
            text="Cash on Delivery"
            boolean={data.payment === "Cash on Delivery"}
            onClick={() =>
              setData((prev) => ({ ...prev, payment: "Cash on Delivery" }))
            }
          />
          {data.payment === "Credit or Debit Card" && (
            <>
              <Heading text="Enter your payment details:" />
              <Input
                name="cname"
                value={data.cname}
                onChange={onChange}
                placeholder="Name on card"
                errName={err.cname}
              />
              <Input
                name="cnumber"
                value={data.cnumber}
                onChange={onChange}
                placeholder="Card number"
                errName={err.cnumber}
              />
            </>
          )}
          <div className={position.button}>
            <Button text="Place Order" onClick={() => onClick("payment")} />
          </div>
          <hr className={position.separator} />
        </div>
      </div>
    </Layout>
  );
}

export default Checkout;

function Title(props) {
  const design = "font-medium text-xl text-gray-900";
  return <h3 className={design}>{props.text}</h3>;
}

function Heading(props) {
  const position = "mt-8";
  const design = "font-medium";
  return <h4 className={`${position} ${design}`}>{props.text}</h4>;
}

function Box(props) {
  const position = {
    container: "flex justify-between p-5 my-2 cursor-pointer",
  };
  const design = {
    container: `${
      props.boolean && "border-gray-700"
    } border border-2 rounded-xl hover:border-gray-700`,
    subtext: "font-light text-gray-500",
  };

  return (
    <div
      className={`${position.container} ${design.container}`}
      onClick={props.onClick}
    >
      <p>{props.text}</p>
      {props.subtext && <p className={design.subtext}>{props.subtext}</p>}
    </div>
  );
}
