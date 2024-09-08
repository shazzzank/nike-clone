import Layout from "../components/layout/layout";
import Cardbig from "../components/cardbig";
import { fullDate } from "../helper";

function Success() {
  const cart = JSON.parse(sessionStorage.getItem("cart"));
  const order = JSON.parse(sessionStorage.getItem("order"));
  const position = {
    container: "flex flex-col gap-2 md:items-center my-5",
    cardContainer: `grid ${cart.length > 1 ? "md:grid-cols-2" : ""} gap-8`,
    card: "w-40 h-36",
    wrapper: "py-5",
  };

  return (
    <Layout>
      <div className={position.container}>
        <Heading text="Thanks! We're on it." />
        <Subtext text={`Ordered ${fullDate(new Date())}`} />
        <Subtext text={`#` + order._id} />
        <Subtext text="Purchased Online" />
        <Separator />
        <div className={position.wrapper}>
          <Badge text="Ordered" />
          <div className={position.cardContainer}>
            {cart.map((item) => (
              <Cardbig
                key={item.product._id}
                className={position.card}
                cart={item}
                product={item.product}
              />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Success;

function Heading(props) {
  const position = "pt-10";
  const design = "font-medium text-3xl";

  return <h2 className={`${position} ${design}`}>{props.text}</h2>;
}

function Subtext(props) {
  const design = `font-light text-xl text-gray-500 ${
    props.type === "lowercase" ? "lowercase" : "capitalize"
  }`;

  return <p className={design}>{props.text}</p>;
}

function Badge(props) {
  const position = "md:text-center mb-10";
  const design = "text-xl font-medium text-green-700";

  return <h3 className={`${position} ${design}`}>{props.text}</h3>;
}

function Separator() {
  const position = "h-2 md:w-3/4 md:mx-auto my-10";
  const design = "bg-gray-100";

  return <hr className={`${position} ${design}`} />;
}
