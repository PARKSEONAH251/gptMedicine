import React from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../utils/auth";

export default function ProtectedRoute({ children }) {
  const user = getCurrentUser(); // 로그인 여부 체크

  if (!user) {
    alert("로그인이 필요합니다.");
    return <Navigate to="/login" replace />;
  }

  return children; // 로그인 되어있으면 페이지 보여주기
}
