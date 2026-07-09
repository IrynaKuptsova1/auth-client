import "./App.css";
import { Route, Switch, Link, useLocation } from "wouter";
import { useState, useEffect, type SubmitEvent } from "react";
import { authValidation } from "./validation"; 

const API = "http://localhost:3000";

export default function App() {
  useEffect(() => {
    fetch(`${API}/health`).catch((err) => console.error(err));
  }, []);

  return (
    <Switch>
      <Route path="/sign_in" component={Sign_in} />
      <Route path="/sign_up" component={Sign_up} />
      <Route path="/me" component={Me} />
    </Switch>
  );
}

function Sign_in() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    const validationResult = authValidation.safeParse({ email, password });
    if (!validationResult.success) {
      const errorMessage = validationResult.error.issues[0]?.message;
      alert(errorMessage);
      return;
    }

    const response = await fetch(`${API}/sign_in`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    
    if (data.accessToken) {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("userEmail", email); 

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      navigate("/me");
    } else {
      alert(data.error);
    }
  };

  const isFormInvalid = !email.trim() || !password.trim();

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
          <div className="form-group__input-wrapper">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              className="form__input form__input--password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
              )}
            </button>
          </div>
        </div>

        <label className="checkbox">
          <input 
            type="checkbox" 
            className="checkbox__input" 
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
          />
          <span>Remember me</span>
        </label>

        <button type="submit" className="btn btn-primary" disabled={isFormInvalid}>Sign in</button>
        
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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Пароли не совпадают!");
      return;
    }

    const validationResult = authValidation.safeParse({ email, password });
    if (!validationResult.success) {
      const errorMessage = validationResult.error.issues[0]?.message;
      alert(errorMessage);
      return;
    }

    const response = await fetch(`${API}/sign_up`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (data.accessToken) {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("userEmail", email); 
      navigate("/me");
    } else {
      alert(data.error);
    }
  };

  const isFormInvalid = !email.trim() || !password.trim() || !confirmPassword.trim();

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
          <div className="form-group__input-wrapper">
            <input
              id="register-password"
              className="form__input form__input--password"
              type={showPassword ? "text" : "password"}
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
              )}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="register-confirm-password">Confirm Password</label>
          <div className="form-group__input-wrapper">
            <input
              id="register-confirm-password"
              className="form__input form__input--password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="********"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
              )}
            </button>
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={isFormInvalid}>
          Sign up
        </button>
        <p className="auth-redirect">Already have an account?{" "}
          <Link href="/sign_in" className="higlight-tekst">Sign in</Link>
        </p>
      </form>
    </div>
  );
}

function Me() {
  const userEmail = localStorage.getItem("userEmail");

  const handleLogout = () => {
    const remembered = localStorage.getItem("rememberedEmail");
    localStorage.clear();
    if (remembered) {
      localStorage.setItem("rememberedEmail", remembered);
    }
    window.location.href = "/sign_in";
  };

  return (
    <div className="sign-in">
      <div className="profile-card">
        <h1 className="profile-card__title">Welcome</h1>
        
        <div className="profile-card__info">
          <span className="profile-card__label">Logged in as:</span>
          <span className="profile-card__email">{userEmail}</span>
        </div>

        <button onClick={handleLogout} className=" btn btn-outline">
          Log out
        </button>
      </div>
    </div>
  );
}