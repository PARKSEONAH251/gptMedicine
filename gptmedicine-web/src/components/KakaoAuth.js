import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./KakaoAuth.css";

export default function KakaoAuth() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init("72d488b55a12a31ca0abd23ce5fe1522");
    }
  }, []);

  const handleKakaoLogin = () => {
    window.Kakao.Auth.login({
      scope: "profile_nickname",
      success: function (authObj) {
        window.Kakao.API.request({
          url: "/v2/user/me",
          success: function (res) {
            const user = {
              id: res.id,
              nickname: res.kakao_account.profile.nickname,
              email: res.kakao_account.email,
            };

            localStorage.setItem("user", JSON.stringify(user));

            navigate("/main");
          },
          fail: function (err) {
            console.error(err);
          }
        });
      },
      fail: function (err) {
        console.error(err);
      }
    });
  };

  return (
    <div className="KakaoAuthContainer">
      <h2 className="KakaoAuthTitle">카카오 계정으로 로그인</h2>

      <p className="KakaoAuthDesc">
        복용 기록을 저장하고<br />
        친구·가족과 연동해 함께 관리하세요.
      </p>

      <button className="KakaoLoginBtn" onClick={handleKakaoLogin}>
        카카오로 로그인하기
      </button>
    </div>
  );
}
