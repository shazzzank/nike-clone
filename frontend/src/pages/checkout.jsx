import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../layout";
import Input from "../components/input";
import Button from "../components/button";

function Checkout() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <Layout>
      <div className="w-2/4 m-auto py-10">
        <hr className="h-px my-4 bg-gray-200" />
        <h3 className="text-xl text-gray-900 font-medium mb-8">Delivery</h3>
        {activeIndex === 0 && <Delivery onNext={() => setActiveIndex(1)} />}
        <hr className="h-px my-4 bg-gray-200" />
        <h3 className="text-xl text-gray-900 font-medium mb-8">Shipping</h3>
        {activeIndex === 1 && <Shipping onNext={() => setActiveIndex(2)} />}
        <hr className="h-px my-4 bg-gray-200" />
        <h3 className="text-xl text-gray-900 font-medium mb-8">Payment</h3>
        {activeIndex === 2 && <Payment />}
      </div>
    </Layout>
  );
}

function Delivery(props) {
  const [boolean, setBoolean] = useState(false);
  const [errors, setErrors] = useState({});
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    address: "",
    email: "",
    phone: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setUser((prevState) => ({ ...prevState, [name]: value }));
  }

  function handleSubmit() {
    let newErrors = {};
    Object.keys(user).forEach((key) => {
      const value = user[key].trim();
      switch (key) {
        case "email":
          if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            newErrors[key] = "Please enter a valid email";
          }
          break;
        case "phone":
          if (!value || !/^\d{10}$/.test(value)) {
            newErrors[key] = "Please enter a valid phone number";
          }
          break;
        default:
          if (!value) {
            newErrors[key] = `Please enter your ${key.replace("_", " ")}`;
          }
          break;
      }
    });
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setBoolean(true);
      props.onNext();
      sessionStorage.setItem("user", JSON.stringify(user));
    }
  }
  return (
    <div className={`${boolean ? "hidden" : "block"}`}>
      <h4 className="font-medium">What's your name and address?</h4>
      <Input
        name="first_name"
        value={user.first_name}
        onChange={handleChange}
        placeholder="First Name"
      />
      {errors.first_name && (
        <span className="block text-sm text-red-500">{errors.first_name}</span>
      )}
      <Input
        name="last_name"
        value={user.last_name}
        onChange={handleChange}
        placeholder="Last Name"
      />
      {errors.last_name && (
        <span className="block text-sm text-red-500">{errors.last_name}</span>
      )}
      <Input
        name="address"
        value={user.address}
        onChange={handleChange}
        placeholder="Address"
      />
      {errors.address && (
        <span className="block text-sm text-red-500">{errors.address}</span>
      )}
      <h4 className="font-medium mt-10">What's your contact information?</h4>
      <Input
        name="email"
        value={user.email}
        onChange={handleChange}
        placeholder="Email"
      />
      {errors.email && (
        <span className="block text-sm text-red-500">{errors.email}</span>
      )}
      <Input
        name="phone"
        value={user.phone}
        onChange={handleChange}
        placeholder="Phone Number"
      />
      {errors.phone && (
        <span className="block text-sm text-red-500 mb-5">{errors.phone}</span>
      )}
      <Button onClick={handleSubmit} text="Continue" />
    </div>
  );
}

function Shipping(props) {
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [price, setPrice] = useState(0);
  const [error, setError] = useState(false);
  const [boolean, setBoolean] = useState(false);

  function setDeliveryDate(i) {
    let startDate = new Date();
    let endDate = new Date();

    switch (i) {
      case 0:
        startDate.setDate(startDate.getDate() + 4);
        endDate.setDate(endDate.getDate() + 7);
        break;
      case 1:
        startDate.setDate(startDate.getDate() + 7);
        endDate.setDate(endDate.getDate() + 10);
        break;
      default:
        return "";
    }
    function formatDate(date) {
      const options = { weekday: "short", day: "numeric", month: "short" };
      return date.toLocaleDateString("en-US", options);
    }
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  }

  function handleSubmit() {
    if (selectedShipping !== null) {
      setBoolean(true);
      props.onNext();
      sessionStorage.setItem(
        "shipping",
        JSON.stringify({
          price,
          date: setDeliveryDate(selectedShipping),
        }),
      );
    } else {
      setError(true);
    }
  }

  return (
    <div className={`${boolean ? "hidden" : "block"}`}>
      <h4 className="font-medium text-xl">When do you want the order?</h4>
      {[0, 1].map((option, i) => (
        <div
          key={i}
          onClick={() => {
            setSelectedShipping(i);
            setError(false);
            setPrice(i === 0 ? 0 : 50);
          }}
          className={`flex justify-between border border-2 rounded-xl px-4 py-6 mt-5 cursor-pointer font-medium ${
            selectedShipping === i && "border-gray-700"
          }`}
        >
          <p>{setDeliveryDate(option)}</p>
          <p className="font-light text-gray-500">{i === 0 ? "Free" : "$50"}</p>
        </div>
      ))}
      {error && (
        <p className="text-sm text-red-500 mx-1 mt-2">
          Please select a shipping option
        </p>
      )}
      <Button onClick={handleSubmit} text="Continue" />
    </div>
  );
}

function Payment() {
  const [boolean, setBoolean] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(0);
  const [errors, setErrors] = useState({});
  const promo = ["TEST123", "TEST1234"];
  const navigate = useNavigate();
  const [payment, setPayment] = useState({
    promo: "",
    card_name: "",
    card_number: "",
    expiry_month: "",
    expiry_year: "",
    CVV: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setPayment((prevState) => ({ ...prevState, [name]: value }));
  }

  function onSubmit() {
    const err = {};
    const isCardPayment = selectedPayment === 0;

    const validate = (key, regex, errorMessage) => {
      const value = payment[key].trim();
      if ((!value && isCardPayment) || (value && !regex.test(value))) {
        err[key] = errorMessage;
      }
    };
    const validatePromo = (key, regex, errorMessage) => {
      const value = payment[key].trim();
      if (value && !regex.test(value)) {
        err[key] = errorMessage;
      }
    };

    validatePromo(
      "promo",
      new RegExp(`^(?:${promo.join("|")})$`),
      "Please enter a valid promo",
    );
    validate("card_number", /^\d{16}$/, "Please enter a valid card number");
    validate("expiry_month", /^\d{2}$/, "Please enter a valid expiry month");
    validate("expiry_year", /^\d{2}$/, "Please enter a valid expiry year");
    validate("CVV", /^\d{3}$/, "Please enter a valid CVV");

    if (Object.keys(err).length === 0) {
      setBoolean(true);
      sessionStorage.setItem(
        "payment",
        JSON.stringify({
          mode: isCardPayment ? "Card" : "Cash",
          ...payment,
        }),
      );
      navigate("/success");
    }
    setErrors(err);
  }

  return (
    <div className={`${boolean ? "hidden" : "block"}`}>
      <h4 className="text-xl font-medium">Have a promo code?</h4>
      <Input
        name="promo"
        value={payment.promo}
        onChange={handleChange}
        placeholder="Promo"
      />
      {errors.promo && (
        <span className="block text-sm text-red-500">{errors.promo}</span>
      )}
      <h4 className="text-xl font-medium mt-10">How would you like to pay?</h4>
      {["Credit or Debit Card", "Cash on Delivery"].map((option, i) => (
        <div
          key={option}
          onClick={() => setSelectedPayment(i)}
          className={`flex justify-between border border-2 rounded-xl px-4 py-6 mt-5 cursor-pointer font-medium ${
            selectedPayment === i && "border-gray-700"
          }`}
        >
          <p>{option}</p>
        </div>
      ))}
      <div className={selectedPayment === 0 ? "block" : "hidden"}>
        <h4 className="text-xl font-medium mt-10">
          Enter your payment details:
        </h4>
        <Input
          name="card_name"
          value={payment.card_name}
          onChange={handleChange}
          placeholder="Name on card"
        />
        {errors.card_name && (
          <span className="block text-sm text-red-500">{errors.card_name}</span>
        )}
        <Input
          name="card_number"
          value={payment.card_number}
          onChange={handleChange}
          placeholder="Card number"
        />
        {errors.card_number && (
          <span className="block text-sm text-red-500">
            {errors.card_number}
          </span>
        )}
        <div className="grid grid-cols-2 gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Input
                name="expiry_month"
                value={payment.expiry_month}
                onChange={handleChange}
                placeholder="MM"
                maxLength="2"
              />
              {errors.expiry_month && (
                <span className="text-sm text-red-500">
                  {errors.expiry_month}
                </span>
              )}
            </div>
            <div>
              <Input
                name="expiry_year"
                value={payment.expiry_year}
                onChange={handleChange}
                placeholder="YY"
                maxLength="2"
              />
              {errors.expiry_year && (
                <span className="text-sm text-red-500">
                  {errors.expiry_year}
                </span>
              )}
            </div>
          </div>
          <div>
            <Input
              name="CVV"
              value={payment.CVV}
              onChange={handleChange}
              placeholder="CVV"
            />
            {errors.CVV && (
              <span className="text-sm text-red-500">{errors.CVV}</span>
            )}
          </div>
        </div>
      </div>
      <Button onClick={() => onSubmit()} text="Place Order" />
    </div>
  );
}

export default Checkout;
