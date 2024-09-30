import "./App.css";
import "./css/checkout.css";
import "./css/style.css";
import "./css/responsive.css";
import "./css/product.css";
import "./css/success.css";
import "./css/navbar.css";
import "./css/navbar1.css";
import "./css/otherBanner.css";
import Allroutes from "./component/Allroutes";
import Footer from "./component/Footer";
import BackToTopButton from "./component/BackToTopButton";
// import NewNav from "./component/NewNav";
import { WatchlistProvider } from "./Pages/WatchlistContext";
import { BrowserRouter } from "react-router-dom";
import CartDefaultFuntion from "./component/CartDefaultFuntion";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { Rings, RotatingLines } from "react-loader-spinner";
import { useState, useEffect } from "react";
import Aos from "aos";
import NewNav1 from "./component/NewNav1";
import Loader1 from "./component/Loader1";

// Main App Component
const App = () => {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
    Aos.init({
      duration: 1000, // Animation duration in milliseconds
      once: false, // Allow animations to trigger multiple times
      mirror: true, // Trigger animations on scroll up
    });
  }, []);
  return (
    <>
      {loading ? (
        // <RotatingLines
        //   visible={true}
        //   height="100vh"
        //   width="50"
        //   color="rgb(195, 148, 40)"
        //   ariaLabel="rings-loading"
        //   strokeColor="#222"
        //   wrapperStyle={{
        //     margin: "auto",
        //     display: "flex",
        //     alignIems: "center",
        //     justifyContent: "center",
        //     backgroundcolot: "transparent",
        //     color: "rgb(195, 148, 40)",
        //   }}
        //   wrapperClass
        // ></RotatingLines>
        <Loader1/>
      ) : (
        <BrowserRouter>
          <WatchlistProvider>
            <CartDefaultFuntion></CartDefaultFuntion>
            <ToastContainer />
            <NewNav1 />
            {/* <NewNav /> */}
            <Allroutes />
            {/* <NewNav1></NewNav1>
            <br/> */}
            <Footer />
            <BackToTopButton />
          </WatchlistProvider>
        </BrowserRouter>
      )}
    </>
  );
};

export default App;
