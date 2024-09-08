import { useState } from "react";
import Layout from "../layout";
import Input from "../components/input";
import Button from "../components/button";

function Register() {
  const [user, setUser] = useState({
    email: "",
  });
  const [errors, setErrors] = useState({});

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
        default:
          if (!value) {
            newErrors[key] = `Please enter your ${key}`;
          }
          break;
      }
    });
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      console.log(user);
    }
  }

  return (
    <Layout>
      <div className="w-3/5 md:w-5/12 lg:w-5/12 m-auto py-20">
        <h2 className="text-3xl text-gray-700 mb-10">
          Enter your email to join or sign in.
        </h2>
        <Input
          name="email"
          value={user.email}
          onChange={handleChange}
          placeholder="Email"
        />
        {errors.email && (
          <span className="block text-sm text-red-500 pt-1">
            {errors.email}
          </span>
        )}
        <div className="inline-block w-1/3 mt-4">
          <Button text="Continue" onClick={handleSubmit} />
        </div>
      </div>
    </Layout>
  );
}

export default Register;
