import React from "react";
import Login from "./Pages/Login";
import "./App.css";
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import Register from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";
import { AuthUserProvider } from "./Contexts/AutUserProvider";
import Links from "./Pages/Links";
import Analytics from "./Pages/Analytics";
import Settings from "./Pages/Settings";
import Redirect from "./Pages/Redirect";
import Notfound from "./Pages/Notfound";

const App = () => {
  return (
    <AuthUserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="links" element={<Links />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="/:shortLink" element={<Redirect />}/>
          <Route path="*" element={<Notfound />} />
        </Routes>
      </BrowserRouter>
    </AuthUserProvider>
  );
};

export default App;
