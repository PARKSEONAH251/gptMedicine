import React, { useState } from "react";
import "./Signup.css";

export default function Signup() {
  const [phone, setPhone] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [sentCode, setSentCode] = useState(null);
  const [verified, setVerified] = useState(false);

  // 인증 번호 보내기
  const sendVerificationCode = async () => {
    if (!phone) {
      alert("전화번호를 입력하세요.");
      return;
    }

    // 테스트용 인증번호 생성
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setSentCode(code);

    alert(`임시 인증번호: ${code}`);
  };

  // 인증 확인
  const checkVerificationCode = () => {
    if (verifyCode === sentCode) {
      setVerified(true);
      alert("인증이 완료되었습니다.");
    } else {
      alert("인증번호가 다릅니다.");
    }
  };

  return (
    <div className="SignupContainer">
      <img src="/image/pattern.png" className="Signup-Primary-Pattern" />
      <img
        src="/image/Primary_Pattern.png"
        className="Signup-Primary-PatternBottonimage"
      />

      <div className="signup-content">
        <p className="Signup-title">회원가입</p>

        {/* 이름 */}
        <label className="Signup-label">이름</label>
        <input
          type="text"
          className="Signup-input"
          placeholder="이름을 입력하세요"
        />

        {/* 아이디 */}
        <label className="Signup-label">아이디</label>
        <input
          type="text"
          className="Signup-input"
          placeholder="아이디를 입력하세요"
        />

        {/* 비밀번호 */}
        <label className="Signup-label">비밀번호</label>
        <input
          type="password"
          className="Signup-input"
          placeholder="비밀번호를 입력하세요"
        />

        {/* 전화번호 */}
        <label className="Signup-label">전화번호</label>
        <div className="phone-row">
          <input
            type="text"
            className="Signup-input phone-input"
            placeholder="전화번호를 입력하세요"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button className="verify-btn" onClick={sendVerificationCode}>
            인증
          </button>
        </div>

        {/* 인증번호 */}
        {sentCode && !verified && (
          <>
            <label className="Signup-label">인증번호</label>
            <div className="phone-row">
              <input
                type="text"
                className="Signup-input phone-input"
                placeholder="인증번호 입력"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value)}
              />
              <button className="verify-btn" onClick={checkVerificationCode}>
                확인
              </button>
            </div>
          </>
        )}

        {verified && <p className="verified-text">✔ 인증 완료</p>}

        <button className="Signup-button">회원가입</button>
      </div>
    </div>
  );
}
