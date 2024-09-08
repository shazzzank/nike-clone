import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
const app = express();

// Server settings
dotenv.config();
app.use(cors());
app.use(express.json());
app.listen(process.env.PORT, () =>
  console.log(`Server kickin at ${process.env.PORT}`),
);

// Database connection
mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING)
  .then(() => console.log("Database kickin"))
  .catch((err) => console.log(err));

// Product model
const Product = mongoose.model("Product", {
  category: { type: String },
  colors: [{ type: String }],
  description: { type: String },
  discount: { type: Number, default: 0 },
  image: { type: String },
  name: { type: String },
  price: { type: Number },
  rating: { type: Number },
  reviews: [{ name: { type: String }, review: { type: String } }],
  sizes: [{ type: Number }],
  slug: { type: String },
  stock: { type: Number },
  created: { type: Date, default: Date.now },
});

// Favorite model
const Favorite = mongoose.model("Favorite", {
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  created: { type: Date, default: Date.now },
});

// Cart model
const Cart = mongoose.model("Cart", {
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  quantity: { type: Number, default: 1 },
  price: { type: Number },
  size: { type: Number },
  color: { type: String },
  created: { type: Date, default: Date.now },
});

// User model
const User = mongoose.model("User", {
  fname: { type: String },
  lname: { type: String },
  address: {
    street: { type: String, default: null },
    building: { type: String, default: null },
    city: { type: String, default: null },
    state: { type: String, default: null },
    country: { type: String, default: null },
    pincode: { type: String, default: null },
  },
  hometown: { type: String, default: null },
  email: { type: String },
  password: { type: String, default: null },
  phone: { type: Number },
  dob: { type: Date, default: null },
  picture: { type: String, default: null },
  username: { type: String, default: () => "user" + Date.now() },
  about: { type: String, default: null },
  role: { type: String, default: "user" },
  created: { type: Date, default: Date.now },
});

// Shipping model
const Shipping = mongoose.model("Shipping", {
  date: { type: Date },
  status: { type: String },
  history: [
    {
      _id: false,
      status: { type: String },
      created: { type: Date, default: Date.now },
    },
  ],
  created: { type: Date, default: Date.now },
});

// Payment model
const Payment = mongoose.model("Payment", {
  promo: { type: String },
  mode: { type: String },
  amount: { type: Number },
  created: { type: Date, default: Date.now },
});

// Order model
const Order = mongoose.model("Order", {
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  payment: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
  cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "Cart" }],
  shipping: { type: mongoose.Schema.Types.ObjectId, ref: "Shipping" },
  created: { type: Date, default: Date.now },
});

// Addresses model
const Address = mongoose.model("Address", {
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  fname: { type: String },
  lname: { type: String },
  phone: { type: Number },
  address: {
    street: { type: String, default: null },
    building: { type: String, default: null },
    city: { type: String, default: null },
    state: { type: String, default: null },
    country: { type: String, default: null },
    pincode: { type: String, default: null },
  },
  created: { type: Date, default: Date.now },
});

// Preferences model
const Preferences = mongoose.model("Preference", {
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  size: { type: Number, default: null },
  gender: { type: String, default: null },
  category: [{ type: String, default: null }],
  measure: { type: String, default: "Metric" },
  communication: { type: String, default: "No" },
  reviewSharing: { type: String, default: "Public" },
  locationSharing: { type: String, default: "No" },
});

// Server routes
app.post("/products", (req, res) => {
  let query = {};
  if (req.body) {
    if (req.body.name !== "" && req.body.name !== undefined) {
      query.name = { $regex: new RegExp(req.body.name, "i") };
    }
    if (req.body.category !== "" && req.body.category !== undefined) {
      query.category = req.body.category;
    }
    if (req.body.minprice !== "" && req.body.minprice !== undefined) {
      query.price = { $gte: req.body.minprice };
    }
    if (req.body.maxprice !== "" && req.body.maxprice !== undefined) {
      query.price = { ...query.price, $lte: req.body.maxprice };
    }
    if (req.body.mindiscount !== "" && req.body.mindiscount !== undefined) {
      query.discount = { $gte: req.body.mindiscount };
    }
    if (req.body.maxdiscount !== "" && req.body.maxdiscount !== undefined) {
      query.discount = { ...query.discount, $lte: req.body.maxdiscount };
    }
    if (req.body.size !== "" && req.body.size !== undefined) {
      query.size = { $in: [req.body.size] };
    }
    if (req.body.color !== "" && req.body.color !== undefined) {
      query.colors = { $in: [req.body.color] };
    }
  }
  Product.find(query)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});

app.post("/product", (req, res) => {
  Object.keys(req.body).length &&
    Product.find(req.body)
      .then((result) => res.send(result))
      .catch((err) => res.send(err));
});

app.post("/favorites", (req, res) => {
  Favorite.find(req.body, { _id: 0, product: 1 })
    .populate("product")
    .then((result) => {
      const products = result.map((fav) => fav.product);
      res.send(products);
    })
    .catch((err) => res.send(err));
});

app.post("/user", (req, res) => {
  Object.keys(req.body).length &&
    User.find(req.body)
      .then((result) => res.send(result))
      .catch((err) => res.send(err));
});

app.post("/order", (req, res) => {
  Order.find(req.body)
    .populate("cart")
    .then((result) => {
      return Order.populate(result, [
        { path: "cart.product", model: "Product" },
        { path: "user" },
        { path: "shipping" },
        { path: "payment" },
      ]);
    })
    .then((result) => res.send(result))
    .catch((err) => res.send(err));
});

app.post("/orders", (req, res) => {
  Order.find(req.body)
    .populate("cart")
    .then((result) => {
      return Order.populate(result, [
        { path: "cart.product", model: "Product" },
        { path: "user" },
        { path: "shipping" },
        { path: "payment" },
      ]);
    })
    .then((result) => res.send(result))
    .catch((err) => res.send(err));
});

app.post("/address", (req, res) => {
  Object.keys(req.body).length &&
    Address.find(req.body)
      .then((result) => res.send(result))
      .catch((err) => res.send(err));
});

app.post("/preferences", (req, res) => {
  Object.keys(req.body).length &&
    Preferences.find(req.body)
      .then((result) => res.send(result))
      .catch((err) => res.send(err));
});

app.post("/product/create", (req, res) => {
  Product.create(req.body)
    .then((result) => res.send(result))
    .catch((err) => res.send(err));
});

app.post("/favorite/create", (req, res) => {
  Favorite.create(req.body)
    .then((result) => res.send(result))
    .catch((err) => res.send(err));
});

app.post("/cart/create", (req, res) => {
  Cart.create(req.body)
    .then((result) => {
      return Cart.populate(result, { path: "product" });
    })
    .then((result) => res.send(result))
    .catch((err) => res.send(err));
});

app.post("/user/create", (req, res) => {
  User.create(req.body)
    .then((result) => res.send(result))
    .catch((err) => res.send(err));
});

app.post("/shipping/create", (req, res) => {
  Shipping.create(req.body)
    .then((result) => res.send(result))
    .catch((err) => res.send(err));
});

app.post("/payment/create", (req, res) => {
  Payment.create(req.body)
    .then((result) => res.send(result))
    .catch((err) => res.send(err));
});

app.post("/order/create", (req, res) => {
  Order.create(req.body)
    .then((result) => {
      return Order.populate(result, [
        { path: "cart" },
        { path: "user" },
        { path: "shipping" },
        { path: "payment" },
      ]);
    })
    .then((result) => res.send(result))
    .catch((err) => res.send(err));
});

app.post("/address/create", (req, res) => {
  Address.create(req.body)
    .then((result) => {
      return Address.find({ user: result?.user }).populate("user");
    })
    .then((result) => res.send(result))
    .catch((err) => res.send(err));
});

app.post("/preferences/create", (req, res) => {
  Preferences.create(req.body)
    .then((result) => {
      return User.populate(result, { path: "user" });
    })
    .then((result) => res.send(result))
    .catch((err) => res.send(err));
});

app.post("/cart/delete", (req, res) => {
  Cart.findByIdAndDelete(req.body)
    .then((result) => res.send(result))
    .catch((err) => res.send(err));
});

app.post("/address/delete", (req, res) => {
  Address.findByIdAndDelete(req.body)
    .then((result) => {
      return Address.find({ user: result?.user }).populate("user");
    })
    .then((result) => res.send(result))
    .catch((err) => res.send(err));
});

app.post("/user/update", (req, res) => {
  User.findByIdAndUpdate({ _id: req.body._id }, req.body, { new: true })
    .then((result) => res.send(result))
    .catch((err) => res.send(err));
});

app.post("/preferences/update", (req, res) => {
  Preferences.findOneAndUpdate({ user: req.body.user }, req.body, { new: true })
    .then((result) => res.send(result))
    .catch((err) => res.send(err));
});

app.post("/product/update", (req, res) => {
  Product.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true })
    .then((result) => res.send(result))
    .catch((err) => res.send(err));
});

app.post("/shipping/update", (req, res) => {
  Shipping.findByIdAndUpdate({ _id: req.body._id }, req.body, { new: true })
    .then((result) => res.send(result))
    .catch((err) => res.send(err));
});
