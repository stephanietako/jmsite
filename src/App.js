import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Maintenance from "./pages/Maintenance";
// Styles
import "./App.scss";

const App = () => {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              JSON.parse(process.env.REACT_APP_MODE_MAINTENANCE) ? (
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
