import React from "react";
import { useNavigate } from "react-router-dom";
import "./Onboarding.css";

export default function Onboarding() {
  const navigate = useNavigate();

  const handleAgree = () => {
    localStorage.setItem("userAgreed", "true");
    navigate("/kakao-auth");
  };

  return (
    <div className="OnboardContainer">
      <div className="TopWave">
        <img src="/image/pattern.png" className="Onboard-Primary-Patterntopimage" />
      </div>

      <p className="AppTag">공유전용앱</p>
      <h2 className="Title">약챗GO 커넥트로{"\n"}함께하는 복용관리</h2>

      <img
        className="GearingIllustration"
        src="/image/gearing.png"
        alt="illustration"
      />

      <button className="StartBtn" onClick={handleAgree}>
        동의하고 시작하기
      </button>
    </div>
  );
}
