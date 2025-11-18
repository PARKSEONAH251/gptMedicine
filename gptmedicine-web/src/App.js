import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginJoin from "./page/LoginJoin";
import Flashback from "./page/Flashback"; // 넘어가기 버튼이 있는 페이지 (예시)
import Login from "./page/Login"; 
import Signup from "./page/Signup";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Flashback />} />         {/* 기본 페이지 */}
        <Route path="/loginjoin" element={<LoginJoin />} /> {/* 이동할 페이지 */}
        <Route path="/login" element={<Login />} />         {/* 로그인 페이지 */}
        <Route path="/signup" element={<Signup />} />       {/* 회원가입 페이지 */}
      </Routes>
    </Router>
  );
}

export default App;
