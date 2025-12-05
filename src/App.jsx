import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Maintenance from "./pages/Maintenance";
import "./App.scss";

const App = () => {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              JSON.parse(import.meta.env.VITE_MODE_MAINTENANCE) ? (
                <Maintenance />
              ) : (
                <Home />
              )
            }
          />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
