// 현재 로그인 중인지 확인하는 함수
export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// 로그아웃 함수
export const logoutUser = () => {
  localStorage.removeItem("user");
};