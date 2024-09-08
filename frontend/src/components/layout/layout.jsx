import Header from "./header";
import Footer from "./footer";

function Layout(props) {
  const position = {
    container: "p-6",
  };

  return (
    <>
      <Header />
      <div className={position.container}>{props.children}</div>
      <Footer />
    </>
  );
}

export default Layout;
