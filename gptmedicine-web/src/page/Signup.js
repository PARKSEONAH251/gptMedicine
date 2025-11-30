import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";
import { db } from "../firebase";
import { doc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { auth, setRecaptcha } from "../firebase";
import { signInWithPhoneNumber } from "firebase/auth";
import "./Signup.css";

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [phone, setPhone] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [verified, setVerified] = useState(false);

  const [timer, setTimer] = useState(0);
  const [isSending, setIsSending] = useState(false);

  const [usernameChecked, setUsernameChecked] = useState(false);

  // 이름: 2~10 한글만
  const validateName = () => {
    const regex = /^[가-힣]{2,10}$/;
    if (!regex.test(name)) {
      alert("이름은 2~10자의 한글만 입력 가능합니다.");
      return false;
    }
    return true;
  };

  // 아이디: 영문+숫자 5~15자
  const validateUsername = () => {
    const regex = /^[a-zA-Z0-9]{5,15}$/;
    if (!regex.test(username)) {
      alert("아이디는 5~15자의 영문 또는 숫자만 가능합니다.");
      return false;
    }
    return true;
  };

  // 비밀번호: 영문+숫자+특수문자 8~20자
  const validatePassword = () => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,20}$/;
    if (!regex.test(password)) {
      alert("비밀번호는 영문+숫자+특수문자 포함 8~20자로 입력해야 합니다.");
      return false;
    }
    return true;
  };

  // 전화번호: 010으로 시작
  const validatePhone = () => {
    const regex = /^010\d{7,8}$/;
    if (!regex.test(phone)) {
      alert("전화번호는 010으로 시작하는 숫자만 입력 가능합니다.");
      return false;
    }
    return true;
  };

  const checkUsernameDuplicate = async () => {
    if (!validateUsername()) return;

    const q = query(
      collection(db, "users"),
      where("username", "==", username)
    );

    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      alert("이미 사용 중인 아이디입니다.");
      setUsernameChecked(false);
      return false;
    } else {
      alert("사용 가능한 아이디입니다!");
      setUsernameChecked(true);
      return true;
    }
  };

  const saveUserToFirestore = async () => {
    try {
      const hashedPassword = bcrypt.hashSync(password, 10);

      await setDoc(doc(db, "users", phone), {
        name,
        username,
        password: hashedPassword,
        phone,
        createdAt: new Date(),
      });

      alert("회원가입이 완료되었습니다!");
      navigate("/login");   // 로그인 화면으로 이동

    } catch (error) {
      console.error("회원정보 저장 오류:", error);
      alert("회원가입에 실패했습니다.");
    }
  };

  const handleSignup = () => {
    if (!validateName()) return;
    if (!validateUsername()) return;
    if (!validatePassword()) return;
    if (!validatePhone()) return;

    if (!usernameChecked) {
      alert("아이디 중복 확인을 해주세요.");
      return;
    }

    if (!verified) {
      alert("전화번호 인증을 먼저 완료하세요.");
      return;
    }

    saveUserToFirestore();
  };

  const sendVerificationCode = async () => {
    if (!validatePhone()) return;

    if (isSending) {
      alert("잠시 후 다시 시도하세요.");
      return;
    }

    try {
      setRecaptcha();
      const converted = "+82" + phone.slice(1);

      const confirmation = await signInWithPhoneNumber(
        auth,
        converted,
        window.recaptchaVerifier
      );

      window.confirmationResult = confirmation;

      alert("인증번호가 전송되었습니다.");
      startTimer(); // 타이머 시작
    } catch (err) {
      console.error(err);
      alert("인증번호 전송 실패: " + err.message);
    }
  };

  const checkVerificationCode = async () => {
    try {
      await window.confirmationResult.confirm(verifyCode);
      setVerified(true);
      alert("인증이 완료되었습니다!");
    } catch (error) {
      alert("인증번호가 올바르지 않습니다.");
    }
  };

  const startTimer = () => {
    setTimer(60);
    setIsSending(true);

    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          setIsSending(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <>

      <div className="AppWrapper">
        <div id="recaptcha-container"></div>

        <div className="SignupContainer">
          <img src="/image/pattern.png" className="Signup-Primary-Pattern" />
          <img src="/image/Primary_Pattern.png" className="Signup-Primary-PatternBottonimage" />

          <div className="signup-content">
            <p className="Signup-title">회원가입</p>

            {/* 이름 */}
            <label className="Signup-label">이름</label>
            <input
              type="text"
              className="Signup-input"
              placeholder="이름을 입력하세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            {/* 아이디 + 중복확인 */}
            <label className="Signup-label">아이디</label>
            <div className="username-row">
              <input
                type="text"
                className="Signup-input"
                placeholder="아이디를 입력하세요"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setUsernameChecked(false);  // 아이디 바뀌면 다시 검증 요구
                }}
              />
              <button className="check-btn" onClick={checkUsernameDuplicate}>
                중복확인
              </button>
            </div>

            {/* 비밀번호 */}
            <label className="Signup-label">비밀번호</label>
            <input
              type="password"
              className="Signup-input"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              <button
                className="verify-btn"
                onClick={sendVerificationCode}
                disabled={isSending}
              >
                {isSending ? `재전송 ${timer}s` : "인증"}
              </button>
            </div>

            {/* 인증번호 입력 */}
            {typeof window !== "undefined" &&
              window.confirmationResult &&
              !verified && (
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

            <button className="Signup-button" onClick={handleSignup}>
              회원가입
            </button>
          </div>
        </div>
      </div>
    </>

  );
}
