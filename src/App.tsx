import "./App.css";
import { Route, Switch } from "wouter";

import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import { useEffect } from "react";

// : "https://auth-server-1xji.onrender.com";

export default function App() {
  useEffect(() => {
    fetch(import.meta.env.VITE_API_URL + "/health");
  }, []);
  return (
    <>
      <Switch>
        <Route path="/sign-in" component={SignIn} />
        <Route path="/sign-up" component={SignUp} />
        <Route path="/" component={Home} />
      </Switch>
    </>
  );
}
