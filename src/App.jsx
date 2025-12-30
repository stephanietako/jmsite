import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import "./App.scss";

// Import dynamique (code splitting)
const Home = lazy(() => import("./pages/Home"));
const Maintenance = lazy(() => import("./pages/Maintenance"));

const App = () => {
  const isMaintenance = JSON.parse(import.meta.env.VITE_MODE_MAINTENANCE);

  return (
    <div className="App">
      <Router>
        <Suspense>
          <Routes>
            <Route
              path="/"
              element={isMaintenance ? <Maintenance /> : <Home />}
            />
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
};

export default App;
