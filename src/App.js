import "./App.css";
import Allroutes from "./component/Allroutes";
import Footer from "./component/Footer";
import Nav from "./component/Nav";
import "./css/style.css";

function App() {
  return (
    <div className="App">
      <Nav />
      <Allroutes/>
      <Footer />  
    </div>
  );
}

export default App;
