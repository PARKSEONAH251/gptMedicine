import React from "react";
import { useNavigate } from "react-router-dom";
import "./Main.css";

export default function Main() {
  const [input, setInput] = React.useState("");
  const [patternHeight, setPatternHeight] = React.useState(0); 
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!input.trim()) {
      alert("약 이름 또는 정보를 입력해주세요!");
      return;
    }

    //검색 페이지로 이동
    navigate(`/search?query=${encodeURIComponent(input)}`);
  };

  return (
    <div className="MainContainer">
      {/* 패턴 이미지 + 높이 읽기 */}
      <img
        src="/image/pattern.png"
        className="Main-PatternTop"
        onLoad={(e) => setPatternHeight(e.target.offsetHeight)} // ⭐ 패턴 높이 측정
      />

      {/* 콘텐츠 위치 자동 조정 */}
      <div className="MainContent">
        <p className="MainTitle">어떤 알약에 정보가 필요하신가요?</p>

        <div className="SearchBox">
          <span className="SearchIcon"></span>
          <input
            type="text"
            className="SearchInput"
            placeholder="Search"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button className="VoiceButton"><img src="/image/voice.png" alt="Voice" /></button>
        </div>

        <button className="CameraBtn">
          <img src="/image/camera.png" alt="Camera" />
          <span className="CameraText">촬영</span>
        </button>
      </div>
    </div>
  );
}
