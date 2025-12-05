import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import "./App.scss";

// Import dynamique (code splitting)
const Home = lazy(() => import("./pages/Home"));
const Maintenance = lazy(() => import("./pages/Maintenance"));

const App = () => {
  return (
    <div className="App">
      <Router>
        <Suspense fallback={<div>Chargement…</div>}>
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
        </Suspense>
      </Router>
    </div>
  );
};

export default App;
