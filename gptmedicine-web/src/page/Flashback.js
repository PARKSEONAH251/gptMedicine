import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./Flashback.css";

export default function Flashback() {
  const navigate = useNavigate();

  const handleSkip = () => {
    navigate("/loginjoin");
  };

  const scrollRef = useRef(null);

  // 왼쪽 스크롤
  const scrollLeft = () => {
    scrollRef.current.scrollBy({
      left: -300,
      behavior: "smooth",
    });
  };

  // 오른쪽 스크롤
  const scrollRight = () => {
    scrollRef.current.scrollBy({
      left: 300,
      behavior: "smooth",
    });
  };

  return (
    <div className="container">
      <img src="/image/pattern.png" className="pattern-image" alt="Pattern" />
      <img src="/image/pattern1.png" className="pattern1-image" alt="Pattern1" />
      <text className="welcome-text">환영합니다!</text>
      <text className="description-text">의료 AI 서비스 약찾고와 함께하세요.</text>
      <div className="carousel-container">
        <button className="scroll-btn left" onClick={scrollLeft}>
          <ChevronLeft size={24} />
        </button>
        <div className="carousel-content" ref={scrollRef}>
          <div className="item">
            <img src="/image/medicalsafe_logo.png" className="logo-image" alt="MedicalSafe Logo" />
          </div>
          <div className="item"></div>
        </div>
        <button className="scroll-btn right" onClick={scrollRight}>
          <ChevronRight size={24} />
        </button>
      </div>
      <button className="skip-button" onClick={handleSkip}>넘어가기</button>
    </div >
  );
}
