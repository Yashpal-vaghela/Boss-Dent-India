import "./App.css";
import Allroutes from "./component/Allroutes";
import Footer from "./component/Footer";
import "./css/style.css";
import "./css/responsive.css";
import BackToTopButton from "./component/BackToTopButton";
import NewNav from "./component/NewNav";
import { AddCartProvider } from "./Pages/AddCartContext";
import { WatchlistProvider } from "./Pages/WatchlistContext";
import { BrowserRouter } from "react-router-dom";
import { useEffect } from "react";
import CartDefaultFuntion from "./component/CartDefaultFuntion";
// import {useSelector,useDispatch} from 'react-redux';
// import { Add } from "./redux/Apislice/cartslice";

// Main App Component
const App = () => {
  return (
    <div>
      <BrowserRouter>
        <WatchlistProvider>
          <CartDefaultFuntion></CartDefaultFuntion>
          {/* <AddCartProvider> */}
            <NewNav />
            <Allroutes />
            <Footer />
            <BackToTopButton />
          {/* </AddCartProvider> */}
        </WatchlistProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;
