import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import "./Login.css";

export default function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        if (!username || !password) {
            alert("아이디와 비밀번호를 입력하세요.");
            return;
        }

        try {
            const q = query(
                collection(db, "users"),
                where("username", "==", username)
            );

            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                alert("존재하지 않는 아이디입니다.");
                return;
            }

            const userData = querySnapshot.docs[0].data();

            const isMatch = bcrypt.compareSync(password, userData.password);

            if (!isMatch) {
                alert("비밀번호가 틀렸습니다.");
                return;
            }

            // 로그인 성공
            localStorage.setItem("user", JSON.stringify(userData));

            alert("로그인 성공!");
            navigate("/main");   // ⭐ 여기에 들어감

        } catch (error) {
            console.error(error);
            alert("로그인 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="LoginContainer">
            <img src="/image/pattern.png" className="Login-Primary-Patterntopimage" />
            <img src="/image/Primary_Pattern.png" className="Login-Primary-PatternBottonimage" />

            <div className="Login-content">
                <p className="Login-title">로그인</p>

                <label className="Login-label">아이디</label>
                <input
                    type="text"
                    className="Login-input"
                    placeholder="아이디를 입력하세요"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <label className="Login-label">비밀번호</label>
                <input
                    type="password"
                    className="Login-input"
                    placeholder="비밀번호를 입력하세요"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button className="Login-button" onClick={handleLogin}>
                    로그인
                </button>
            </div>
        </div>
    );
}
