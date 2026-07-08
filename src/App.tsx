import "./App.css";
import { Route, Switch, Link, useLocation } from "wouter";
import { useState,  type SubmitEvent } from "react";

const API = "http://localhost:5173/";
export default function App() {
  return (
    <Switch>
      <Route path="/sign_in">
        <Sign_in />
      </Route>
      <Route path="/sign_up">
        <Sign_up />
      </Route>
      
    </Switch>
  );
}
function Sign_in() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    const response = await fetch(`${API}/sign_in`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (data.accessToken) {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      navigate("/me");
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="sign-in">
      <form className="sign-in__form form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            className="form__input"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            className="form__input"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <label className="checkbox">
          <input type="checkbox" className="checkbox__input" />
          <span>Show password</span>
        </label>

        <button type="submit" className="btn btn-primary">Sign in</button>
        
        <p className="auth-redirect">
          Don't have an account?{" "}
          <Link href="/sign_up" className="higlight-tekst">Sign up</Link>
        </p>
      </form>
    </div>
  );
}

function Sign_up() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    const response = await fetch(`${API}/sign_up`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (data.accessToken) {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      navigate("/me");
    } else {
      alert(data.error || "Something went wrong");
    }
  };

  return (
    <div className="sign-in"> 
    <form className="sign-in__form form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="register-email">Email</label>
          <input
            id="register-email"
            className="form__input"
            type="email"
            placeholder="Enter your email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="register-password">Password</label>
          <input
            id="register-password"
            className="form__input"
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <label className="checkbox">
          <input type="checkbox" className="checkbox__input" />
          <span>Show password</span>
        </label>

        <button type="submit" className="btn btn-primary">Sign up</button>
        <p className="auth-redirect">
          Already have an account?{" "}
          <Link href="/sign_in" className="higlight-tekst">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
