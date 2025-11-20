import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Flashback from "./page/Flashback";   // 추가
import LoginJoin from "./page/LoginJoin";   // 추가
import Login from "./page/Login";           // 추가
import Signup from "./page/Signup";         // 추가
import SearchResult from "./page/SearchResult";

import ProtectedRoute from "./components/ProtectedRoute"; // 로그인 보호
import Main from "./page/Main"; // 로그인 후 이동 페이지

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Flashback />} />
        <Route path="/loginjoin" element={<LoginJoin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/search" element={<SearchResult />} />

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
