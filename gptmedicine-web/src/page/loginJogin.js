import React from "react";
import "./LoginJoinScreen.css";

export default function LoginJoinScreen() {
  return (
    <div className="container">
      <div className="image-section">
        <img src="/pattern.png" alt="Pattern" className="pattern-image" />
      </div>
      <div className="button-section">
        <button className="login-button">Log In</button>
        <button className="join-button">Join Now</button>
      </div>
    </div>
  );
}
