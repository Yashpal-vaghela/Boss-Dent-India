import "./App.css";
import Allroutes from "./component/Allroutes";
import Footer from "./component/Footer";
import "./css/style.css"; 
import "./css/responsive.css";
import BackToTopButton from "./component/BackToTopButton";
import NewNav from "./component/NewNav";

function App() {
  return (
    <div className="App">
       <NewNav />
      <Allroutes/>
      <Footer />  
      <BackToTopButton/>
    </div>
  );
}

export default App;
