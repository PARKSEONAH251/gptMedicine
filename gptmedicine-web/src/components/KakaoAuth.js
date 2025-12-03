import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { connectWithInviter } from "../utils/KakaoFriendConnect"; // ⭐ STEP 4 핵심
import "./KakaoAuth.css";

export default function KakaoAuth() {
  const navigate = useNavigate();
  
  // Kakao SDK 초기화
  useEffect(() => {
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init("72d488b55a12a31ca0abd23ce5fe1522"); // JS KEY
    }
  }, []);

  // ⭐ 카카오 로그인 기능
  const handleKakaoLogin = () => {
    window.Kakao.Auth.login({
      scope: "profile_nickname, profile_image", // 요청 권한
      success: function (authObj) {
        
        // 사용자 정보 요청
        window.Kakao.API.request({
          url: "/v2/user/me",
          success: function (res) {
            // 로그인 사용자 정보 저장
            const user = {
              id: res.id,
              nickname: res.kakao_account.profile.nickname,
              email: res.kakao_account.email,
            };

            localStorage.setItem("user", JSON.stringify(user));

            // ⭐ 초대 기반 친구 연결 STEP 4
            connectWithInviter(res.id);

            // 로그인 후 이동 (필요에 따라 /calendar로 변경 가능)
            navigate("/main");
          },

          fail: function (err) {
            console.error("사용자 정보 요청 실패:", err);
          }
        });
      },

      fail: function (err) {
        console.error("카카오 로그인 실패:", err);
      }
    });
  };

  return (
    <div className="KakaoAuthContainer">
      <img className="kakoamainimage" src="/image/kakao.png"></img>
      <h2 className="KakaoAuthTitle">카카오 계정으로 로그인</h2>

      <p className="KakaoAuthDesc">
        복용 기록을 저장하고<br />
        친구·가족과 연동해 함께 관리하세요.
      </p>

      <button className="KakaoLoginBtn" onClick={handleKakaoLogin}>
        카카오로 로그인하기
      </button>

      <p className="KakaoSmallText">
        카카오 로그인을 통해 약 복용 데이터를 저장합니다.
      </p>
    </div>
  );
}
