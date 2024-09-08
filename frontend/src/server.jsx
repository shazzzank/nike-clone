import axios from "axios";
import slugify from "slugify";
import { uploadImage } from "./helper";

const domain = "https://nike-clone-gamma-snowy.vercel.app";

function getProduct(identifier, setProduct) {
  axios
    .post(`${domain}/product`, identifier)
    .then((res) => setProduct(res.data[0]))
    .catch((err) => console.log(err));
}

function getProducts(identifier, setProducts) {
  axios
    .post(`${domain}/products`, identifier)
    .then((res) => setProducts(res.data))
    .catch((err) => console.log(err));
}

function getFavorites(identifier, setFavorites) {
  axios
    .post(`${domain}/favorites`, identifier)
    .then((res) => setFavorites(res.data))
    .catch((err) => console.log(err));
}

function getUser(identifier, setUser) {
  axios
    .post(`${domain}/user`, identifier)
    .then((res) => setUser(res.data[0]))
    .catch((err) => console.log(err));
}

function getOrder(identifier, setOrder) {
  axios
    .post(`${domain}/order`, identifier)
    .then((res) => setOrder(res.data[0]))
    .catch((err) => console.log(err));
}

function getOrders(identifier, setOrder) {
  axios
    .post(`${domain}/orders`, identifier)
    .then((res) => setOrder(res.data))
    .catch((err) => console.log(err));
}

function getAddress(identifier, setAddress) {
  axios
    .post(`${domain}/address`, identifier)
    .then((res) => setAddress(res.data))
    .catch((err) => console.log(err));
}

function getPreferences(identifier, setPreferences) {
  axios
    .post(`${domain}/preferences`, identifier)
    .then((res) => setPreferences(res.data[0]))
    .catch((err) => console.log(err));
}

function createFavorite(identifier, setFavorite) {
  axios
    .post(`${domain}/favorite/create`, identifier)
    .then((res) => setFavorite(res.data))
    .catch((err) => console.log(err));
}

function createCart(identifier, setCart) {
  axios
    .post(`${domain}/cart/create`, identifier)
    .then((res) => setCart(res.data))
    .catch((err) => console.log(err));
}

function createUser(identifier, setUser) {
  axios
    .post(`${domain}/user/create`, identifier)
    .then((res) => setUser(res.data))
    .catch((err) => console.log(err));
}

function createShipping(identifier, setShipping) {
  axios
    .post(`${domain}/shipping/create`, identifier)
    .then((res) => setShipping(res.data))
    .catch((err) => console.log(err));
}

function createPayment(identifier, setPayment) {
  axios
    .post(`${domain}/payment/create`, identifier)
    .then((res) => setPayment(res.data))
    .catch((err) => console.log(err));
}

function createOrder(identifier, setOrder) {
  axios
    .post(`${domain}/order/create`, identifier)
    .then((res) => setOrder(res.data))
    .catch((err) => console.log(err));
}

function createAddress(identifier, setAddress) {
  axios
    .post(`${domain}/address/create`, identifier)
    .then((res) => setAddress(res.data))
    .catch((err) => console.log(err));
}

function createPreferences(identifier) {
  axios
    .post(`${domain}/preferences/create`, identifier)
    .catch((err) => console.log(err));
}

function createProduct(data, setProduct) {
  uploadImage(data.image, (url) => {
    data.image = url;
    data.slug = slugify(data.name, { lower: true });
    axios
      .post(`${domain}/product/create`, data)
      .then((res) => setProduct(res.data))
      .catch((err) => console.log(err));
  });
}

function deleteCart(identifier) {
  axios
    .post(`${domain}/cart/delete`, identifier)
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
}

function deleteAddress(identifier, setAddress) {
  axios
    .post(`${domain}/address/delete`, identifier)
    .then((res) => {
      setAddress(res.data);
    })
    .catch((err) => console.log(err));
}

function updatePreferences(data, setPreferences) {
  axios
    .post(`${domain}/preferences/update`, data)
    .then((res) => setPreferences(res.data))
    .catch((err) => console.log(err));
}

function updateProduct(data, setProduct) {
  uploadImage(data.image, (url) => {
    data.image = url;
    data.slug = slugify(data.name, { lower: true });
    axios
      .post(`${domain}/product/update`, data)
      .then((res) => setProduct(res.data))
      .catch((err) => console.log(err));
  });
}

function updateShipping(identifier, setShipping) {
  axios
    .post(`${domain}/shipping/update`, identifier)
    .then((res) => setShipping(res.data))
    .catch((err) => console.log(err));
}

function updateUser(identifier, setUser) {
  axios
    .post(`${domain}/user/update`, identifier)
    .then((res) => setUser(res.data))
    .catch((err) => console.log(err));
}

export {
  getProduct,
  getProducts,
  getFavorites,
  getUser,
  getOrder,
  getOrders,
  getAddress,
  getPreferences,
  createFavorite,
  createCart,
  createUser,
  createShipping,
  createPayment,
  createOrder,
  createAddress,
  createPreferences,
  createProduct,
  deleteCart,
  deleteAddress,
  updatePreferences,
  updateProduct,
  updateShipping,
  updateUser,
};
