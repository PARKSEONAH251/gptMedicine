import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Onboarding.css";

export default function Onboarding() {
  const navigate = useNavigate();
  const [patternHeight, setPatternHeight] = React.useState(0);


  // 🌟 STEP 3: URL에서 invite 파라미터 읽기
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const inviterId = params.get("invite");

    if (inviterId) {
      console.log("초대한 사람 ID:", inviterId);
      localStorage.setItem("inviterId", inviterId);
    }
  }, []);

  // 🌟 초대 메시지 보내기 (너가 만든 STEP 2 기능)
  const handleInviteSend = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    const inviterId = user.id;

    const inviteLink = `http://localhost:3000/onboarding?invite=${inviterId}`;

    if (!window.Kakao.isInitialized()) {
      window.Kakao.init("72d488b55a12a31ca0abd23ce5fe1522");
    }

    window.Kakao.Link.sendDefault({
      objectType: "text",
      text: `약챗GO 커넥트에서 복용 캘린더를 함께 공유해요!`,
      link: {
        mobileWebUrl: inviteLink,
        webUrl: inviteLink,
      },
      buttonTitle: "초대 수락하기",
    });

    navigate("/calendar");
  };

  return (
    <div className="OnboardContainer">
      <div className="TopWave">
        <img
          src="/image/pattern.png"
          className="Onboarding-PatternTop"
          onLoad={(e) => setPatternHeight(e.target.offsetHeight)} // ⭐ 패턴 높이 측정
        />
      </div>

      <p className="AppTag">공유전용앱</p>
      <h2 className="Title">약챗GO 커넥트로{"\n"}함께하는 복용관리</h2>

      <img className="GearingIllustration" src="/image/gearing.png" alt="illustration" />

      <button className="StartBtn" onClick={handleInviteSend}>
        동의하고 시작하기
      </button>
    </div>
  );
}
