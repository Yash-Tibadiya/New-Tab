import "./App.css";
import CryptoTracker from "./Components/Crypto/Crypto";
import Greeting from "./Components/Greeting/Greeting";
import Time from "./Components/Time/Time";
import Weather from "./Components/Weather/Weather";

function App() {
  return (
    <>
      <div className="app-wrapper">
        <div className="App">
          <div className="item1">{/* <Bookmarks /> */}</div>
          <div className="item2">
            <Time />
          </div>
          <div className="item3">
            <Greeting />
          </div>
          <div className="item4">
            <Weather />
          </div>
          <div className="item5">{/* <Todo /> */}</div>
          <div className="item6">
            <CryptoTracker />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
