import { Link, useLocation } from "wouter";
import { authValidation } from "../validation";
import { useEffect, useState } from "react";
import { isNonEmptyString } from "../types";

export default function SignIn() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [showNotification, setShowNotification] = useState(() => {
    return sessionStorage.getItem("session_expired") === "true";
  });

  useEffect(() => {
    if (showNotification) {
      sessionStorage.removeItem("session_expired");
    }
  }, [showNotification]);

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setFormError(null);

    const validationResult = authValidation.safeParse({ email, password });
    if (!validationResult.success) {
      const errorMessage = validationResult.error.issues[0]?.message;
      setFormError(errorMessage || "Please fill in all fields correctly");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/sign-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (
        isNonEmptyString(data.accessToken) &&
        isNonEmptyString(data.refreshToken)
      ) {
        setShowNotification(false);
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("userEmail", email);
        navigate("/");
      } else {
        setFormError(data.error || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setFormError("Unable to connect to server");
    }
  };

  const isFormInvalid = !email.trim() || !password.trim();

  return (
    <div className="sign-in">
      {showNotification && (
  <div className="session-expired-pop">
    <div className="session-expired-pop__content">
      <span>Your session has expired. Please sign in again.</span>
      <button
        type="button" 
        
        onClick={() => setShowNotification(false)} 
        className="session-expired-pop__close"
      >
        &times;
      </button>
    </div>
  </div>
)}

      <form className="sign-in__form form" onSubmit={handleSubmit}>
        <div className="form__error-wrapper">
          {formError && (
            <div className="form__error-message">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="form__error-icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z"
                />
              </svg>
              <span>{formError}</span>
            </div>
          )}
        </div>

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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
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

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isFormInvalid}
        >
          Sign in
        </button>

        <Link href="/sign-up" className="auth-redirect-link">
          Don't have an account?{" "}
          <span className="highlight-tekst">Sign up</span>
        </Link>
      </form>
    </div>
  );
}
