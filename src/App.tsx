//import { useState } from 'react'
import './App.css'

function App() {
    return (
        <div className="sign-in">
            <form className="sign-in__form form">
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        className="form__input"
                        placeholder="Enter your email"
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        className="form__input"
                        placeholder="********"
                    />
                </div>

                <label className="checkbox">
                    <input type="checkbox" className="checkbox__input" />
                    <span>Show password</span>
                </label>

                <button type="submit" className="btn btn-primary">Sign in</button>
                <p className="auth-redirect">
                    Don't have an account? <span className="higlight-tekst">Sign up</span>
                </p>
            </form>
        </div>
    );
}

export default App;