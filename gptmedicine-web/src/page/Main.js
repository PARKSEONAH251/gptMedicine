import React from "react";
import { useNavigate } from "react-router-dom";
import "./Main.css";

export default function Main() {
  const [input, setInput] = React.useState("");
  const [preview, setPreview] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isListening, setIsListening] = React.useState(false); // 🔥 음성 상태
  const navigate = useNavigate();
  const fileInputRef = React.useRef(null);

  /* ---------------------------
        검색 실행
  --------------------------- */
  const handleSearch = () => {
    if (!input.trim() && !preview) {
      alert("약 이름 또는 이미지를 입력해주세요!");
      return;
    }

    // 📸 이미지 OCR 기반 검색
    if (preview) {
      navigate(`/search?imageOCR=true&preview=${encodeURIComponent(preview)}`);
      return;
    }

    // 🔍 텍스트 검색
    navigate(`/search?query=${encodeURIComponent(input)}`);
  };

  /* ---------------------------
     카메라 실행 → 파일 선택
  --------------------------- */
  const openCamera = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  /* ---------------------------
     이미지 촬영 후 처리
  --------------------------- */
  const handleCapture = (e) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const imageURL = URL.createObjectURL(file);

    setPreview(imageURL);
  };

  /* ---------------------------
      미리보기 이미지 삭제
  --------------------------- */
  const removeImage = () => {
    setPreview(null);
    setInput("");
  };

  /* ---------------------------
      음성인식
  --------------------------- */
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  const startVoiceRecognition = () => {
    if (!recognition) {
      alert("현재 브라우저에서는 음성 인식을 지원하지 않습니다.");
      return;
    }

    // 🔥 listening 상태면 중지
    if (isListening) {
      recognition.stop();
      setIsListening(false);
      return;
    }

    // 🔥 새로운 음성 인식 시작
    recognition.lang = "ko-KR";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();
    setIsListening(true);

    recognition.onstart = () => console.log("🎤 음성 인식 시작");

    recognition.onspeechend = () => {
      recognition.stop();
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      const voiceText = event.results[0][0].transcript;
      setInput(voiceText);
      handleSearch();
    };
  };

  return (
    <div className="MainContainer">
      <img src="/image/pattern.png" className="Main-PatternTop" />

      <img
        src="/image/Primary_Pattern.png"
        className="Login-Primary-PatternBottonimage"
      />

      <div className="MainContent">
        <p className="MainTitle">어떤 알약에 정보가 필요하신가요?</p>

        <div className="SearchBox">
          <span className="SearchIcon"></span>

          {/* 📸 이미지 미리보기 (썸네일) */}
          {preview && (
            <div className="PreviewWrapper">
              <img
                src={preview}
                alt="preview"
                className="SearchPreviewImage"
                onClick={() => setIsModalOpen(true)}
              />
              <button className="RemoveImageBtn" onClick={removeImage}>
                ✕
              </button>
            </div>
          )}

          <input
            type="text"
            className="SearchInput"
            placeholder="Search"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />

          {/* 🎤 음성 버튼 */}
          <button
            className={`VoiceButton ${isListening ? "listening" : ""}`}
            onClick={startVoiceRecognition}
          >
            <img src="/image/voice.png" alt="Voice" />
          </button>
        </div>

        {/* 🔥🔥🔥 듣는 중 + 파형 애니메이션 UI (추가된 부분) */}
        {isListening && (
          <div className="ListeningBox">
            <div className="WaveContainer">
              <div className="wave"></div>
              <div className="wave"></div>
              <div className="wave"></div>
            </div>
            <p className="ListeningText">듣는 중…</p>
          </div>
        )}
        {/* 🔥🔥🔥 여기까지 추가 */}

        <div className="btn-container">
          <button className="CameraBtn" onClick={openCamera}>
            <img src="/image/camera.png" alt="Camera" />
            <span className="CameraText">촬영</span>
          </button>

          <button
            className="calendarBtn"
            onClick={() => navigate("/Calendar")}
          >
            <img src="/image/calendar.png" alt="Calendar" />
            <span className="CalendarText">일정 관리</span>
          </button>
        </div>

        {/* 숨겨진 카메라 input */}
        <input
          type="file"
          accept="image/*"
          capture="environment"
          ref={fileInputRef}
          onChange={handleCapture}
          style={{ display: "none" }}
        />

        {/* 📸 이미지 전체 화면 확대 모달 */}
        {isModalOpen && (
          <div className="ImageModal" onClick={() => setIsModalOpen(false)}>
            <img src={preview} className="ModalImage" alt="big-preview" />
          </div>
        )}
      </div>
    </div>
  );
}
