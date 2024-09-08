import express from "express";
import cors from "cors";
import mongoose from "mongoose";
const app = express();

// Server settings
app.use(cors());
app.use(express.json());
app.listen(8000, () => console.log("Server kickin"));

// Database connection
mongoose
  .connect(
    "mongodb+srv://admin:VpC3KJ76HPK-u85KE-KXDk-Rdx8@ecom.1vtmdyo.mongodb.net/ecom",
  )
  .then(() => console.log("Database kickin"))
  .catch((err) => console.log(err));

// Product model
const Product = mongoose.model("Product", {
  category: { type: String },
  colors: [{ type: String }],
  created: { type: Date, default: Date.now },
  description: { type: String },
  discount: { type: Number, default: 0 },
  image: { type: String },
  name: { type: String },
  price: { type: Number },
  rating: { type: Number },
  review: [{ name: { type: String }, review: { type: String } }],
  size: [{ type: Number }],
  slug: { type: String },
  stock: { type: Number },
});

// User model
const User = mongoose.model("User", {
  first_name: { type: String },
  last_name: { type: String },
  email: { type: String },
  password: { type: String, default: null },
  phone: { type: Number },
  address: { type: String },
  origin: { type: String },
  created: { type: Date, default: Date.now },
});

// Cart model
const Cart = mongoose.model("Cart", {
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  quantity: { type: Number, default: 1 },
  price: { type: Number },
  size: { type: Number },
  color: { type: String },
});

// Order model
const Order = mongoose.model("Order", {
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: "Cart" },
  amount: { type: Number },
  status: { type: String, default: "Pending" },
  delivery_date: { type: Date },
  created: { type: Date, default: Date.now },
});

// Payment model
const Payment = mongoose.model("Payment", {
  order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  mode: { type: String },
  amount: { type: Number },
  status: { type: String },
  promo: { type: String },
  created: { type: Date, default: Date.now },
});

app.get("/", (req, res) => {
  res.send("Only post requests are allowed");
});

// Server routes
app.post("/product/create", (req, res) => {
  Product.create(req.body)
    .then((result) => res.send(result))
    .catch((err) => res.send(err));
});

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
  let query = {};
  if (req.body.slug !== "" && req.body.slug !== undefined) {
    query.slug = req.body.slug;
  }
  if (req.body._id !== "" && req.body._id !== undefined) {
    query._id = req.body._id;
  }
  Product.find(query)
    .then((result) => res.send(result))
    .catch((err) => res.send(err));
});

app.post("/user/create", (req, res) => {
  User.create(req.body)
    .then((result) => res.send(result))
    .catch((err) => res.send(err));
});

app.post("/cart/create", (req, res) => {
  Cart.create(req.body)
    .then((result) => res.send(result))
    .catch((err) => res.send(err));
});

app.post("/order/create", (req, res) => {
  Order.create(req.body)
    .then((result) => res.send(result))
    .catch((err) => res.send(err));
});

app.post("/payment/create", (req, res) => {
  Payment.create(req.body)
    .then((result) => res.send(result))
    .catch((err) => res.send(err));
});
