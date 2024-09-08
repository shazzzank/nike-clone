import axios from "axios";

function getDiscount(price, dpercent) {
  return parseInt((price * dpercent) / 100);
}

function getDiscountedPrice(price, dpercent) {
  return parseInt(price - getDiscount(price, dpercent));
}

function getTax(price, dpercent) {
  const discountPrice = getDiscountedPrice(price, dpercent);
  return parseInt(discountPrice * 0.088);
}

function getTaxedPrice(price, dpercent) {
  const discountPrice = getDiscountedPrice(price, dpercent);
  const tax = getTax(price, dpercent);
  return parseInt(discountPrice + tax);
}

function validate(name, value) {
  let error = false;
  let errMessage = "";
  switch (name) {
    case "city":
      error = value.trim() === "";
      errMessage = "Please enter valid city name";
      break;
    case "cname":
      error = value.trim() === "";
      errMessage = "Please enter valid card name";
      break;
    case "cnumber":
      error = !/^\d{16}$/.test(value.trim());
      errMessage = "Please enter valid card number";
      break;
    case "country":
      error = value.trim() === "";
      errMessage = "Please enter valid country name";
      break;
    case "email":
      error = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
      errMessage = "Please enter valid email address";
      break;
    case "fname":
      error = value.trim() === "";
      errMessage = "Please enter valid first name";
      break;
    case "lname":
      error = value.trim() === "";
      errMessage = "Please enter valid last name";
      break;
    case "password":
      error =
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          value.trim(),
        );
      errMessage =
        "Password must be 8+ characters, with uppercase, lowercase, number, and special character.";
      break;
    case "phone":
      error = !/^\d{10}$/.test(value.toString().trim());
      errMessage = "Please enter valid phone number";
      break;
    case "promo":
      error = value && !/^\d{5}$/.test(value.trim());
      errMessage = "Please enter valid promo code";
      break;
    case "street":
      error = value.trim() === "";
      errMessage = "Please enter valid street name";
      break;
    case "state":
      error = value.trim() === "";
      errMessage = "Please enter valid state name";
      break;
    case "discount":
    case "stock":
      error = value && !/^[0-9]{1,2}$/.test(value.toString().trim());
      errMessage = `Please enter valid ${name}`;
      break;
    case "price":
      error = value && !/^[0-9]{1,5}$/.test(value.toString().trim());
      errMessage = "Please enter valid price";
      break;
    case "category":
    case "description":
    case "pincode":
    case "username":
      error = value.toString().trim() === "";
      errMessage = `Please enter valid ${name}`;
      break;
    default:
      break;
  }
  return { error, errMessage };
}

function shippingDaysToDate(days) {
  const today = new Date();
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + days);
  const options = { weekday: "short", day: "numeric", month: "short" };
  return futureDate.toLocaleDateString("en-US", options); //Thu, Jun 13
}

function getDaysToDate(days) {
  const today = new Date();
  today.setDate(today.getDate() + days);
  return today;
}

function shippingDate(date) {
  const newDate = new Date(date);
  const options = { weekday: "short", day: "numeric", month: "short" };
  return newDate.toLocaleDateString("en-US", options);
}

function membershipDate(date) {
  const today = new Date(date);
  const options = { month: "long", year: "numeric" };
  return today.toLocaleDateString("en-US", options); //June 2024
}

function fullDate(date) {
  date = new Date(date);
  const options = { month: "short", day: "2-digit", year: "numeric" };
  return date.toLocaleDateString("en-US", options); //Apr 30, 2020
}

function daysDifference(start, end) {
  start = new Date(start);
  start = start.getTime();
  end = new Date(end);
  end = end.getTime();
  return Math.floor((end - start) / (1000 * 60 * 60 * 24));
}

function uploadImage(data, setImage) {
  const formData = new FormData();
  formData.append("file", data);
  formData.append("upload_preset", "ooc9lwa4");
  formData.append("public_id", Date.now());
  formData.append("folder", "shoes");

  axios
    .post("https://api.cloudinary.com/v1_1/dyima0a4z/image/upload", formData)
    .then((res) => {
      setImage(res.data.secure_url);
      console.log(res.data.secure_url);
    })
    .catch((err) => console.log(err));
}

export {
  daysDifference,
  getDaysToDate,
  getDiscount,
  getDiscountedPrice,
  getTaxedPrice,
  getTax,
  validate,
  shippingDaysToDate,
  membershipDate,
  shippingDate,
  fullDate,
  uploadImage,
};
