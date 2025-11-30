import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Flashback from "./page/Flashback";
import LoginJoin from "./page/LoginJoin";
import Login from "./page/Login";
import Signup from "./page/Signup";
import SearchResult from "./page/SearchResult";
import Calendar from "./page/Calendar";
import Alarm from "./page/Alarm";
import Onboarding from "./page/Onboarding";
import KakaoAuth from "./components/KakaoAuth";

import ProtectedRoute from "./components/ProtectedRoute";
import Main from "./page/Main";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Flashback />} />
        <Route path="/loginjoin" element={<LoginJoin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/search" element={<SearchResult />} />
        <Route path="/alarm" element={<Alarm/>}/>
        <Route path="/onboarding" element={<Onboarding/>}/> 
        <Route path="/kakao-auth" element={<KakaoAuth />} />
``
        {/* 일정 관리 페이지 */}
        <Route path="/calendar" element={<Calendar />} />

        {/* 로그인 보호 페이지 */}
        <Route
          path="/main"
          element={
            <ProtectedRoute>
              <Main />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
