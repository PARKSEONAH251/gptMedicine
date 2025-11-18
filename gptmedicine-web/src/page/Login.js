import React from "react";
import "./Login.css";

export default function Login() {
    return (
        <div className="LoginContainer">
            <img src="/image/pattern.png" className="Login-Primary-Patterntopimage" />
            <img src="/image/Primary_Pattern.png" className="Login-Primary-PatternBottonimage" />

            <div className="Login-content">
                <p className="Login-title">로그인</p>

                <label className="Login-label">아이디</label>
                <input type="text" className="Login-input" placeholder="아이디를 입력하세요" />

                <label className="Login-label">비밀번호</label>
                <input type="password" className="Login-input" placeholder="비밀번호를 입력하세요" />

                <button className="Login-button">로그인</button>
            </div>
        </div>

    );
}
