import "./App.css";
import { Route, Switch } from "wouter";

import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Home from "./components/Home";

// : "https://auth-server-1xji.onrender.com";

export default function App() {
  return (
    <>
      <Switch>
        <Route path="/sign_in" component={SignIn} />
        <Route path="/sign_up" component={SignUp} />
        <Route path="/" component={Home} />
      </Switch>
    </>
  );
}
