import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Backbutton from "../components/backbutton";
import Button from "../components/button";
import Checkbox from "../components/checkbox";
import Grid from "../components/grid";
import Input from "../components/input";
import Layout from "../components/layout/layout";
import Modal from "../components/modal";
import Multiselect from "../components/multiselect";
import Picture from "../components/picture";
import Progressbar from "../components/progressbar";
import Radio from "../components/radio";
import Select from "../components/select";
import SelectCountry from "../components/selectCountry";
import SelectState from "../components/selectState";
import Textarea from "../components/textarea";
import Topbar from "../components/topbar";
import AddIcon from "../icons/add";
import BoxIcon from "../icons/box";
import ChatIcon from "../icons/chat";
import FilterIcon from "../icons/filter";
import HouseIcon from "../icons/house";
import LinkIcon from "../icons/link";
import PrivacyIcon from "../icons/privacy";
import RemoveIcon from "../icons/remove";
import ShareIcon from "../icons/share";
import UserIcon from "../icons/user";
import {
  getDaysToDate,
  daysDifference,
  getTax,
  getDiscount,
  membershipDate,
  fullDate,
  validate,
} from "../helper";
import {
  getUser,
  getOrders,
  getAddress,
  getProducts,
  getPreferences,
  deleteAddress,
  createAddress,
  createPreferences,
  createProduct,
  updatePreferences,
  updateProduct,
  updateShipping,
  updateUser,
} from "../server";

function Dashboard() {
  const position = { container: "sm:mx-10", separator: "h-0.5 my-4" };
  const design = { separator: "bg-gray-300" };
  const [heading, setHeading] = useState("Profile");
  const { route } = useParams();

  return (
    <Layout>
      <div className={position.container}>
        <Topbar
          heading={heading}
          setHeading={setHeading}
          items={
            route === "user"
              ? ["Profile", "Inbox", "Orders", "Settings"]
              : ["Profile", "Inbox", "Orders", "Products", "Settings"]
          }
        />
        <hr className={`${position.separator} ${design.separator}`} />
        <Content heading={heading} />
      </div>
    </Layout>
  );
}

function Content(props) {
  let content;
  const position = { container: "mt-10" };
  const [user, setUser] = useState(
    JSON.parse(sessionStorage.getItem("user")) || null,
  );
  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [addresses, setAddresses] = useState({});
  const [preferences, setPreferences] = useState({});
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (user) {
      getOrders({ user: user._id }, setOrders);
      getOrders({}, setAllOrders);
      getAddress({ user: user._id }, setAddresses);
      getProducts({}, setProducts);
      getPreferences({ user: user._id }, setPreferences);
      getUser({ _id: user._id }, setUser);
    }
  }, []);

  switch (props.heading) {
    case "Profile":
      content = <Profile user={user} />;
      break;
    case "Inbox":
      content = <Inbox orders={orders} />;
      break;
    case "Orders":
      content = (
        <Orders orders={orders} allOrders={allOrders} role={user.role} />
      );
      break;
    case "Products":
      content = <Products products={products} />;
      break;
    case "Settings":
      content = (
        <Settings user={user} addresses={addresses} preferences={preferences} />
      );
      break;
    default:
      break;
  }
  return (
    <div className={position.container}>
      {user ? content : <Text>You're not logged in yet</Text>}
    </div>
  );
}

function Profile(props) {
  const position = {
    container: "flex flex-col gap-3 items-center justify-center",
  };

  return (
    <div className={position.container}>
      <Picture icon={<UserIcon />} />
      <Heading>{props.user?.fname + " " + props.user?.lname}</Heading>
      <Text>Member since {membershipDate(props.user?.created)}</Text>
    </div>
  );
}

function Inbox(props) {
  const position = {
    container: "flex justify-between items-center px-10",
    wrapper: "w-1/2 *:my-1",
    separator: "my-10",
  };

  return (
    <div>
      {props.orders.map((order) =>
        [...order.shipping.history].reverse().map((item) => (
          <div key={item.status}>
            <div className={position.container}>
              <Picture icon={<BoxIcon />} />
              <div className={position.wrapper}>
                <Subheading>{item.status}</Subheading>
                <Subtext>Order ID# {order._id}</Subtext>
              </div>
              <Subsubtext>{fullDate(item.created)}</Subsubtext>
            </div>
            <hr className={position.separator} />
          </div>
        )),
      )}
    </div>
  );
}

function Orders(props) {
  const [product, setProduct] = useState({});
  const [order, setOrder] = useState({});
  const [boolean, setBoolean] = useState(false);
  const orders = props.role === "admin" ? props.allOrders : props.orders;

  if (orders) {
    if (!boolean) {
      return (
        <Grid
          orders={orders}
          onClick={({ product, order }) => {
            setOrder(order);
            setProduct(product);
            setBoolean(!boolean);
          }}
        />
      );
    } else {
      return (
        <Order
          product={product}
          order={order}
          setBoolean={setBoolean}
          boolean={boolean}
          role={props.role}
        />
      );
    }
  } else return <Text>You don't have any orders yet.</Text>;
}

function Order(props) {
  const position = {
    container: "grid grid-cols-1 sm:grid-cols-2 gap-10 w-11/12 m-auto py-10",
    wrapper: "py-5 *:my-1",
    image: "sticky top-0 p-4",
    progressbar: "py-10",
  };
  const design = {
    image: "object-contain bg-gray-100 rounded-xl",
  };
  const [shipping, setShipping] = useState(props.order.shipping || {});

  function updateProgress(progress) {
    updateShipping(
      {
        ...shipping,
        date: progress === "Return Placed" ? getDaysToDate(5) : shipping.date,
        status: progress,
        history: [
          ...shipping.history,
          { status: progress, created: new Date() },
        ],
      },
      setShipping,
    );
  }

  return (
    <>
      <Backbutton boolean={props.boolean} setBoolean={props.setBoolean} />
      <div className={position.container}>
        <img
          className={`${position.image} ${design.image}`}
          src={props.product.product.image}
          alt={props.product.product.name}
        />
        <div>
          <Subheading>{props.product.product.name}</Subheading>
          <div className={position.wrapper}>
            <Subtext>Purchased Online - {fullDate(shipping.date)}</Subtext>
            <Subtext>
              {props.order._id} - US${props.order.payment.amount}
            </Subtext>
            <Subtext>
              {`${props.order.user.address.city}, ${props.order.user.address.state}, ${props.order.user.address.country}, ${props.order.user.address.pincode}`}
            </Subtext>
          </div>
          {props.role === "user" &&
            daysDifference(shipping.date, fullDate(new Date())) < 25 &&
            shipping.status === "Delivered" && (
              <Button
                text="Start Return"
                onClick={() => updateProgress("Return Placed")}
              />
            )}
          <Progressbar
            role={props.role}
            index={shipping.status}
            items={
              shipping.history.some((entry) => entry.status === "Return Placed")
                ? [
                    "Return Placed",
                    "Processing",
                    "Preparing to Pickup",
                    "Shipped",
                    "Refunded",
                  ]
                : [
                    "Order Placed",
                    "Processing",
                    "Preparing to Ship",
                    "Shipped",
                    "Delivered",
                  ]
            }
            onClick={updateProgress}
          />
          <Price itemOne="Subtotal" itemTwo={props.product.product.price} />
          <Price
            itemOne="Discount"
            itemTwo={getDiscount(
              props.product.product.price,
              props.product.product.discount,
            )}
            negative="true"
          />
          <Price
            itemOne="Delivery"
            itemTwo={
              daysDifference(shipping.date, shipping.created) === -7
                ? "0"
                : "50"
            }
          />
          <Price
            itemOne="Tax"
            itemTwo={getTax(
              props.product.product.price,
              props.product.product.discount,
            )}
          />
          <Price
            itemOne="Total"
            itemTwo={
              props.product.price +
              (daysDifference(shipping.date, shipping.created) === -7 ? 0 : 50)
            }
            bold="true"
          />
        </div>
      </div>
    </>
  );
}

function Products(props) {
  const position = {
    addicon: "mb-5",
  };
  const design = {
    addicon: "text-gray-800 scale-125 cursor-pointer",
  };
  const [boolean, setBoolean] = useState(false);
  const [route, setRoute] = useState(null);
  const [product, setProduct] = useState({
    name: props.product?.name || "",
    description: props.product?.description || "",
    category: props.product?.category || "",
    price: props.product?.price || "",
    discount: props.product?.discount || "",
    slug: "",
    stock: props.product?.stock || "",
    sizes: props.product?.sizes || [],
    colors: props.product?.colors || [],
    image: props.product?.image || "",
  });
  const [err, setErr] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    discount: "",
    slug: "",
    colors: "",
    stock: "",
  });

  function onChange(e) {
    const { name, value, files, checked } = e.target;
    if (name === "sizes" || name === "colors") {
      if (name === "sizes") {
        setProduct((prev) => ({
          ...prev,
          sizes: checked
            ? [...prev.sizes, parseFloat(value)]
            : prev.sizes.filter((item) => item !== parseFloat(value)),
        }));
      } else {
        setProduct((prev) => ({
          ...prev,
          colors: checked
            ? [...prev.colors, value]
            : prev.colors.filter((item) => item !== value),
        }));
      }
    } else if (name === "image") {
      setProduct((prev) => ({ ...prev, image: files[0] }));
    } else {
      setProduct((prev) => ({ ...prev, [name]: value }));
    }
  }

  function onClick() {
    let errr = {};
    Object.entries(product).forEach(([name, value]) => {
      const { error, errMessage } = validate(name, value);
      errr = { ...errr, [name]: error ? errMessage : "" };
      setErr((prev) => ({ ...prev, [name]: error ? errMessage : "" }));
    });
    if (
      !errr.name &&
      !errr.description &&
      !errr.category &&
      !errr.price &&
      !errr.discount &&
      !errr.stock
    ) {
      route === "Create"
        ? createProduct(product, setProduct)
        : updateProduct(product, setProduct);
    }
  }

  if (!boolean) {
    return (
      <>
        <AddIcon
          className={`${position.addicon} ${design.addicon}`}
          onClick={() => {
            setRoute("Create");
            setBoolean(!boolean);
          }}
        />
        <Grid
          products={props.products}
          onClick={(item) => {
            setProduct(item);
            setRoute("Update");
            setBoolean(!boolean);
          }}
        />
      </>
    );
  } else {
    return (
      <Product
        route={route}
        boolean={boolean}
        setRoute={setRoute}
        setBoolean={setBoolean}
        product={product}
        title={route}
        onChange={onChange}
        onClick={onClick}
        err={err}
      />
    );
  }
}

function Product(props) {
  const position = {
    container: "w-3/4 mx-auto mb-10",
    wrapper: "mt-8 mb-5",
    image: "w-3/5 h-3/5 p-4 mb-2",
    defaultimage: "flex items-center justify-center h-72 w-3/5 p-4 mb-2",
  };

  const design = {
    image: "text-gray-400 object-contain bg-gray-100 rounded-xl",
  };
  return (
    <>
      <Backbutton boolean={props.boolean} setBoolean={props.setBoolean} />
      <div className={position.container}>
        <Subheading>{props.route} Product</Subheading>
        <div className={position.wrapper}>
          {typeof props.product.image == "string" &&
          props.product.image !== "" ? (
            <img
              className={`${position.image} ${design.image}`}
              src={props.product.image}
              alt={props.product.name}
            />
          ) : (
            <div className={`${position.defaultimage} ${design.image}`}>
              Image unavailable
            </div>
          )}
          <Input
            name="name"
            placeholder="Name"
            value={props.product.name}
            onChange={props.onChange}
            errName={props.err.name}
          />
          <Textarea
            name="description"
            placeholder="Description"
            value={props.product.description}
            onChange={props.onChange}
            errName={props.err.description}
          />
          <Input
            name="category"
            placeholder="Category"
            value={props.product.category}
            onChange={props.onChange}
            errName={props.err.category}
          />
          <input
            name="image"
            placeholder="Upload Image"
            type="file"
            onChange={props.onChange}
          />
          <Wrapper>
            <Input
              name="price"
              placeholder="Price"
              value={props.product.price}
              onChange={props.onChange}
              errName={props.err.price}
            />
            <Input
              name="discount"
              placeholder="Discount"
              value={props.product.discount}
              onChange={props.onChange}
              errName={props.err.discount}
            />
          </Wrapper>
          <Wrapper>
            <Multiselect
              name="sizes"
              placeholder="Size"
              checked={props.product.sizes || []}
              onChange={props.onChange}
              options={[
                5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12,
              ]}
            />
            <Multiselect
              name="colors"
              placeholder="Color"
              checked={props.product.colors || []}
              onChange={props.onChange}
              options={["green", "blue", "red", "yellow", "gray"]}
            />
          </Wrapper>
          <Input
            name="stock"
            placeholder="Stock"
            value={props.product.stock}
            onChange={props.onChange}
            errName={props.err.stock}
          />
        </div>
        <Button text={props.route} onClick={props.onClick} />
      </div>
    </>
  );
}

function Price(props) {
  const position = "flex justify-between mt-3";
  return (
    <>
      {props.bold ? (
        <>
          <hr className={position} />
          <div className={position}>
            <p>{props.itemOne}</p>
            <p>${props.itemTwo}</p>
          </div>
        </>
      ) : props.negative ? (
        <>
          <div className={position}>
            <Subtext>{props.itemOne}</Subtext>
            <Subtext>- ${props.itemTwo}</Subtext>
          </div>
        </>
      ) : (
        <div className={position}>
          <Subtext>{props.itemOne}</Subtext>
          <Subtext>${props.itemTwo}</Subtext>
        </div>
      )}
    </>
  );
}

function Settings(props) {
  const position = {
    container: "grid grid-cols-1 md:grid-cols-2 gap-10",
    wrapper: "w-3/4 py-2",
  };
  const [content, setContent] = useState(<AccountDetails user={props.user} />);

  return (
    <div className={position.container}>
      <Sidebar
        setContent={setContent}
        user={props.user}
        addresses={props.addresses}
        preferences={props.preferences}
      />
      <div className={position.wrapper}>{content}</div>
    </div>
  );
}

function Sidebar(props) {
  const position = {
    container: "*:flex *:gap-5 *:mb-5",
    icon: "w-6 h-6",
  };
  const design = { container: "*:cursor-pointer" };

  function onClick(e) {
    switch (e.target.innerHTML) {
      case "Account Details":
        props.setContent(<AccountDetails user={props.user} />);
        break;
      case "Delivery Addresses":
        props.setContent(
          <DeliveryAddresses user={props.user} addresses={props.addresses} />,
        );
        break;
      case "Shop Preferences":
        props.setContent(
          <ShopPreferences user={props.user} preferences={props.preferences} />,
        );
        break;
      case "Communication Preferences":
        props.setContent(
          <CommunicationPreferences
            user={props.user}
            preferences={props.preferences}
          />,
        );
        break;
      case "Profile Visibility":
        props.setContent(
          <ProfileVisibility
            user={props.user}
            preferences={props.preferences}
          />,
        );
        break;
      case "Linked Accounts":
        props.setContent(<LinkedAccounts />);
        break;
    }
  }

  return (
    <div className={`${position.container} ${design.container}`}>
      <div>
        <UserIcon className={position.icon} />
        <p onClick={onClick}>Account Details</p>
      </div>
      <div>
        <HouseIcon />
        <p onClick={onClick}>Delivery Addresses</p>
      </div>
      <div>
        <FilterIcon />
        <p onClick={onClick}>Shop Preferences</p>
      </div>
      <div>
        <ChatIcon />
        <p onClick={onClick}>Communication Preferences</p>
      </div>
      <div>
        <ShareIcon />
        <p onClick={onClick}>Profile Visibility</p>
      </div>
      <div>
        <LinkIcon />
        <p onClick={onClick}>Linked Accounts</p>
      </div>
    </div>
  );
}

function AccountDetails(props) {
  const [data, setData] = useState({
    email: props.user.email,
    password: props.user.password,
    phone: props.user.phone,
    country: props.user.address.country || "",
    state: props.user.address.state || "",
    city: props.user.address.city || "",
    pincode: props.user.address.pincode || "",
  });
  const [err, setErr] = useState({
    email: "",
    country: "",
    state: "",
    city: "",
    pincode: "",
  });
  const [country, setCountry] = useState(props.user.address.country);
  const position = { container: "my-5" };

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
      !errr.email &&
      !errr.city &&
      !errr.state &&
      !errr.country &&
      !errr.pincode
    ) {
      const user = {
        _id: props.user._id,
        address: {
          street: data.street,
          building: data.building,
          city: data.city,
          state: data.state,
          country: data.country,
          pincode: data.pincode,
        },
        email: data.email,
        fname: props.user.fname,
        lname: props.user.lname,
        password: data.password,
        phone: data.phone,
      };
      updateUser(user, (res) => {
        setData(res);
        sessionStorage.setItem("user", JSON.stringify(res));
      });
    }
  }

  return (
    <>
      <Subheading>Account Details</Subheading>
      <div className={position.container}>
        <Input
          name="email"
          placeholder="Email*"
          value={data.email}
          onChange={onChange}
          errName={err.email}
        />
        <Input
          name="password"
          placeholder="Password"
          type="password"
          value={data.password}
          onChange={onChange}
        />
        <Input
          name="phone"
          placeholder="Phone"
          value={data.phone}
          onChange={onChange}
        />
        <SelectCountry
          name="country"
          value={data.country}
          onChange={onChange}
          placeholder="Country/Region*"
          setCountry={setCountry}
          errName={err.country}
        />
        <SelectState
          name="state"
          value={data.state}
          onChange={onChange}
          placeholder="State*"
          country={country}
          errName={err.state}
        />
        <Input
          name="city"
          placeholder="Town/City*"
          value={data.city}
          onChange={onChange}
          errName={err.city}
        />
        <Input
          name="pincode"
          placeholder="Postcode*"
          value={data.pincode}
          onChange={onChange}
          errName={err.pincode}
        />
      </div>
      <Button text="Save" onClick={onClick} />
    </>
  );
}

function DeliveryAddresses(props) {
  const [data, setData] = useState({
    fname: "",
    lname: "",
    street: "",
    building: "",
    city: "",
    pincode: "",
    country: "",
    state: "",
    phone: "",
  });
  const [err, setErr] = useState({
    fname: "",
    lname: "",
    phone: "",
    street: "",
    building: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });
  const [addresses, setAddresses] = useState(props.addresses);
  const [country, setCountry] = useState(null);
  const [boolean, setBoolean] = useState(false);
  const position = {
    container: "my-5 relative",
    badge: "w-5 h-5 absolute right-40 hover:scale-100 hover:cursor-pointer",
  };

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
      !errr.phone &&
      !errr.street &&
      !errr.city &&
      !errr.state &&
      !errr.country &&
      !errr.pincode
    ) {
      createAddress(
        {
          user: props.user._id,
          fname: data.fname,
          lname: data.lname,
          phone: data.phone,
          address: {
            street: data.street,
            building: data.building,
            city: data.city,
            state: data.state,
            country: data.country,
            pincode: data.pincode,
          },
        },
        (res) => {
          setAddresses(res);
        },
      );
      setBoolean(false);
    }
  }

  return (
    <>
      <Subheading>Delivery Addresses</Subheading>
      <div className={position.container}>
        {addresses.length > 0 &&
          addresses.map((item) => (
            <div className={position.container}>
              <RemoveIcon
                className={position.badge}
                onClick={() => deleteAddress({ _id: item._id }, setAddresses)}
              />
              <Text>
                {item.fname} {item.lname}
              </Text>
              <Text>{item.address.street}</Text>
              <Text>{item.address.building}</Text>
              <Text>
                {item.address.city}, {item.address.state} {item.address.pincode}
              </Text>
            </div>
          ))}
        {boolean && (
          <Modal boolean={boolean} setBoolean={setBoolean}>
            <Subheading>Add Address</Subheading>
            <div className={position.container}>
              <Wrapper>
                <Input
                  name="fname"
                  placeholder="First Name*"
                  value={data.fname}
                  onChange={onChange}
                  errName={err.fname}
                />
                <Input
                  name="lname"
                  placeholder="Last Name*"
                  value={data.lname}
                  onChange={onChange}
                  errName={err.lname}
                />
              </Wrapper>
              <Input
                name="street"
                placeholder="Street Address*"
                value={data.street}
                onChange={onChange}
                errName={err.street}
              />
              <Input
                name="building"
                placeholder="Apt, Suite, Building"
                value={data.building}
                onChange={onChange}
                errName={err.building}
              />
              <Wrapper>
                <Input
                  name="city"
                  placeholder="Town/City*"
                  value={data.city}
                  onChange={onChange}
                  errName={err.city}
                />
                <Input
                  name="pincode"
                  placeholder="Postcode*"
                  value={data.pincode}
                  onChange={onChange}
                  errName={err.pincode}
                />
              </Wrapper>
              <Wrapper>
                <SelectCountry
                  name="country"
                  value={data.country}
                  onChange={onChange}
                  placeholder="Country*"
                  setCountry={setCountry}
                  errName={err.country}
                />
                <SelectState
                  name="state"
                  value={data.state}
                  onChange={onChange}
                  placeholder="State*"
                  country={country}
                  errName={err.state}
                />
              </Wrapper>
              <Input
                name="phone"
                placeholder="Phone Number*"
                value={data.phone}
                onChange={onChange}
                errName={err.phone}
              />
            </div>
            <Button text="Save" onClick={onClick} />
          </Modal>
        )}
      </div>
      <Button text="Add Address" onClick={() => setBoolean(!boolean)} />
    </>
  );
}

function ShopPreferences(props) {
  const [data, setData] = useState({
    size: props.preferences?.size || "",
    gender: props.preferences?.gender || "",
    category: props.preferences?.category || [],
    measure: props.preferences?.measure || "",
    user: props.user._id,
  });
  const position = { container: "*:mb-5" };

  function onChange(e) {
    const { name, value, checked } = e.target;
    if (name === "category") {
      setData((prev) => ({
        ...prev,
        category: checked
          ? [...prev.category, value]
          : prev.category.filter((item) => item !== value),
      }));
    } else setData((prev) => ({ ...prev, [name]: value }));
  }
  function onClick() {
    props.preferences?._id ? updatePreferences(data) : createPreferences(data);
  }

  return (
    <>
      <div className={position.container}>
        <Subheading>Shop Preferences</Subheading>
        <Select
          name="size"
          placeholder="Shoe Size*"
          value={data.size}
          onChange={onChange}
          options={[
            { name: "5", value: 5 },
            { name: "5.5", value: 5.5 },
            { name: "6", value: 6 },
            { name: "6.5", value: 6.5 },
            { name: "7", value: 7 },
            { name: "7.5", value: 7.5 },
            { name: "8", value: 8 },
            { name: "8.5", value: 8.5 },
            { name: "9", value: 9 },
            { name: "9.5", value: 9.5 },
            { name: "10", value: 10 },
            { name: "10.5", value: 10.5 },
            { name: "11", value: 11 },
            { name: "11.5", value: 11.5 },
            { name: "12", value: 12 },
          ]}
        />
        <Subsubheading>Shopping Preferences</Subsubheading>
        <Text>
          <Radio
            name="gender"
            options={["Men's", "Women's"]}
            onChange={onChange}
            checked={data.gender}
          />
        </Text>
        <Subsubheading>Additional Preferences</Subsubheading>
        <Text>
          <Checkbox
            name="category"
            options={["Men's", "Women's", "Girls'", "Boys'"]}
            onChange={onChange}
            checked={data.category}
          />
        </Text>
        <Subsubheading>Unit of Measure</Subsubheading>
        <Text>
          <Radio
            name="measure"
            options={["Metric", "Imperial"]}
            onChange={onChange}
            checked={data.measure}
          />
        </Text>
      </div>
      <Button text="Save" onClick={onClick} />
    </>
  );
}

function CommunicationPreferences(props) {
  const [data, setData] = useState({
    communication: props.preferences?.communication || "",
    user: props.user._id || "",
  });
  const position = { container: "*:mb-5" };

  function onChange(e) {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  }
  function onClick() {
    props.preferences?.communication
      ? updatePreferences(data)
      : createPreferences(data);
  }

  return (
    <>
      <div className={position.container}>
        <Subheading>Communication Preferences</Subheading>
        <Subsubheading>Get updates on products, offers, and more</Subsubheading>
        <Text>
          <Radio
            name="communication"
            options={["Yes, send me emails.", "No"]}
            onChange={onChange}
            checked={data.communication}
          />
        </Text>
        <Button text="Save" onClick={onClick} />
      </div>
    </>
  );
}

function ProfileVisibility(props) {
  const [data, setData] = useState({
    reviewSharing: props.preferences?.reviewSharing || "",
    locationSharing: props.preferences?.locationSharing || "",
    user: props.user._id,
  });
  const [user, setUser] = useState({
    fname: props.user.fname,
    lname: props.user.lname,
    username: props.user.username,
    hometown: props.user.hometown,
    about: props.user.about,
    _id: props.user._id,
  });
  const [err, setErr] = useState({ fname: "", lname: "", username: "" });
  const [boolean, setBoolean] = useState(false);
  const position = {
    container: "*:mb-5",
    wrapper: "*:mb-5",
  };

  function onChange(e) {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  }
  function userOnChange(e) {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  }
  function onClick() {
    props.preferences?.reviewSharing
      ? updatePreferences(data)
      : createPreferences(data);
  }
  function userOnClick() {
    let errr = {};
    Object.entries(user).forEach(([name, value]) => {
      const { error, errMessage } = validate(name, value);
      errr = { ...errr, [name]: error ? errMessage : "" };
      setErr((prev) => ({ ...prev, [name]: error ? errMessage : "" }));
    });
    if (!err.fname && !err.lname && !err.username) {
      updateUser(user);
    }
  }

  return (
    <>
      <div className={position.container}>
        <Subheading>Profile Visibility</Subheading>
        <Text>
          Your profile represents you on product reviews, inquiries and across
          the community.
        </Text>
        <Wrapper>
          <Picture icon={<UserIcon />} />
          <div className={position.wrapper}>
            <div>
              <Subsubheading>Profile Display</Subsubheading>
              <Subtext>{props.user.username}</Subtext>
            </div>
            <Button text="Edit" onClick={() => setBoolean(true)} light />
          </div>
        </Wrapper>
        <hr />
        <Subsubheading>Product Review Visibility</Subsubheading>
        <Text>
          <Radio
            name="reviewSharing"
            options={["Private", "Public"]}
            onChange={onChange}
            checked={data.reviewSharing}
          />
        </Text>
        <Subsubheading>Location Sharing</Subsubheading>
        <Text>
          <Radio
            name="locationSharing"
            options={["Yes", "No"]}
            onChange={onChange}
            checked={data.locationSharing}
          />
        </Text>
      </div>
      <Button text="Save" onClick={onClick} />
      {boolean && (
        <Modal boolean={boolean} setBoolean={setBoolean}>
          <div className={position.container}>
            <div>
              <Input
                name="fname"
                placeholder="First Name*"
                onChange={userOnChange}
                value={user.fname}
                errName={err.fname}
              />
              <Input
                name="lname"
                placeholder="Last Name*"
                onChange={userOnChange}
                value={user.lname}
                errName={err.lname}
              />
              <Input
                name="username"
                placeholder="Screen Name*"
                onChange={userOnChange}
                value={user.username}
                errName={err.username}
              />
              <Input
                name="hometown"
                placeholder="Hometown"
                onChange={userOnChange}
                value={user.hometown}
              />
              <Input
                name="about"
                placeholder="About Me"
                onChange={userOnChange}
                value={user.about}
              />
            </div>
            <Button text="Save" onClick={userOnClick} />
          </div>
        </Modal>
      )}
    </>
  );
}

function LinkedAccounts() {
  const position = { container: "*:mb-5", wrapper: "flex gap-2 p-6" };
  const design = { wrapper: "bg-gray-100" };
  return (
    <div className={position.container}>
      <Subheading>Linked Accounts</Subheading>
      <Subsubheading>
        Manage account and services connected to your account.
      </Subsubheading>
      <div className={`${position.wrapper} ${design.wrapper}`}>
        <PrivacyIcon />
        <Text>You don't have any connected apps or services.</Text>
      </div>
    </div>
  );
}

function Heading(props) {
  const design = "text-4xl";
  return <h1 className={design}>{props.children}</h1>;
}

function Subheading(props) {
  const design = "text-xl";
  return <h2 className={design}>{props.children}</h2>;
}

function Subsubheading(props) {
  return <h3>{props.children}</h3>;
}

function Text(props) {
  const design = "font-light";
  return <p className={design}>{props.children}</p>;
}

function Subtext(props) {
  const design = "font-light text-gray-500";
  return <p className={design}>{props.children}</p>;
}

function Subsubtext(props) {
  const design = "text-sm font-light text-gray-500";
  return <p className={design}>{props.children}</p>;
}

function Wrapper(props) {
  const position = "flex gap-5";
  return <div className={position}>{props.children}</div>;
}

export default Dashboard;
