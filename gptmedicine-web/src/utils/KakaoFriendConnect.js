// 📌 초대 기반 친구 연결 처리 파일
// KakaoAuth.js에서 로그인 성공 후 호출하면 됨

export function connectWithInviter(kakaoUserId) {
  const inviterId = localStorage.getItem("inviterId");

  // 초대자가 없다면 연결할 필요 없음
  if (!inviterId) return;

  // 친구 목록 구조 가져오기
  const friendData = JSON.parse(localStorage.getItem("friends")) || {};

  // 🔥 초대한 사람 → 나
  if (!friendData[inviterId]) friendData[inviterId] = [];
  if (!friendData[inviterId].includes(kakaoUserId)) {
    friendData[inviterId].push(kakaoUserId);
  }

  // 🔥 나 → 초대한 사람
  if (!friendData[kakaoUserId]) friendData[kakaoUserId] = [];
  if (!friendData[kakaoUserId].includes(inviterId)) {
    friendData[kakaoUserId].push(inviterId);
  }

  // 저장
  localStorage.setItem("friends", JSON.stringify(friendData));

  // 초대자 정보는 1회용이므로 삭제
  localStorage.removeItem("inviterId");

  console.log("💚 친구 연동 완료!");
  console.log(friendData);
}
