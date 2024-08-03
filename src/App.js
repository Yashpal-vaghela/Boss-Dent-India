import "./App.css";
import Allroutes from "./component/Allroutes";
import Footer from "./component/Footer";
import Nav from "./component/Nav";
import "./css/style.css"; 
import "./css/responsive.css";
import BackToTopButton from "./component/BackToTopButton";

function App() {
  return (
    <div className="App">
       <Nav />
      <Allroutes/>
      <Footer />  
      <BackToTopButton/>
    </div>
  );
}

export default App;
