import "./App.css";
import "./css/usersdata.css";
import Allroutes from "./component/Allroutes";
import BackToTopButton from "./component/BackToTopButton";
import { WatchlistProvider } from "./Pages/WatchlistContext";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import Aos from "aos";
import NewNav1 from "./component/NewNav1";
import Loader1 from "./component/Loader1";
import ScrollTop from "./component/ScrollTop";
import NewFooter from "./component/NewFooter";

// Main App Component
const App = () => {
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 0);
    Aos.init({
      duration: 1000,
      once: false,
      mirror: true,
    });
  }, []);

  return (
    <>
      {loading ? (
        <Loader1 />
      ) : (
        <BrowserRouter>
          <WatchlistProvider>
            <ToastContainer />
            <ScrollTop/>
            <NewNav1 />
            {/* <NewNav /> */}
            <Allroutes />
            <NewFooter/>
            <BackToTopButton />
          </WatchlistProvider>
        </BrowserRouter>
      )}
    </>
  );
};

export default App;
