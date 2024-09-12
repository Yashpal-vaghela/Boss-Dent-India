import "./App.css";
import Allroutes from "./component/Allroutes";
import Footer from "./component/Footer";
import "./css/checkout.css";
import "./css/style.css";
import "./css/responsive.css";
import BackToTopButton from "./component/BackToTopButton";
import NewNav from "./component/NewNav";
// import { AddCartProvider } from "./Pages/AddCartContext";
import { WatchlistProvider } from "./Pages/WatchlistContext";
import { BrowserRouter } from "react-router-dom";
import CartDefaultFuntion from "./component/CartDefaultFuntion";
import BreadCrumbs from "./component/BreadCrumbs";

// Main App Component
const App = () => {
  return (
    <>
      <BrowserRouter>
        <WatchlistProvider>
          {/* <BreadCrumbs></BreadCrumbs> */}
          <CartDefaultFuntion></CartDefaultFuntion>
          {/* <AddCartProvider> */}
            <NewNav />
            <Allroutes />
            {/* <Footer /> */}
            {/* <BackToTopButton /> */}
          {/* </AddCartProvider> */}
        </WatchlistProvider>
      </BrowserRouter>
    </>
  );
};

export default App;
