//import { useState } from 'react'
import './App.css'

function App() {
    return (
        <div className="sign_in">
            <div className="sign_in-card">
                <label>Email</label>
                <input
                    type="email"
                    placeholder="Enter your email"
                />
                <label>Password</label>
                <input
                    type="password"
                    placeholder="********"
                />
                <div className="checkbox">
                    <input type="checkbox"/>
                    <span>Show password</span>
                </div>
                <button>Sign in</button>
                <p>Don't have an account?
                  <span>Sign up</span></p>
            </div>
        </div>
    );
}

export default App;