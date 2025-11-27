import React, { useState } from "react";
import "./Calendar.css";

export default function Calendar() {
  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  // ⭐ 날짜 선택 상태
  const [selectedDate, setSelectedDate] = useState(null);

  // ⭐ 날짜별 기록 저장
  const [recordData, setRecordData] = useState({});

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  // 날짜 리스트 생성
  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= lastDate; i++) days.push(i);

  // 날짜 key 포맷 (2025-11-03)
  const formatDate = (y, m, d) => `${y}-${m + 1}-${d}`;

  // 체크 업데이트
  const updateCheck = (field) => {
    if (!selectedDate) return;

    const key = selectedDate;
    setRecordData((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: !prev[key]?.[field],
      },
    }));
  };

  // ⭐ 이전달 / 다음달 이동 함수
  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
    setSelectedDate(null);
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
    setSelectedDate(null);
  };

  return (
    <div className="CalContainer">
      <img src="/image/mini_pattern.png" className="Login-Primary-Patterntopimage" />
      <img src="/image/Primary_Pattern.png" className="Login-Primary-PatternBottonimage" />
      <button className="AddFriendButton"><img src="/image/group.png" className="AddFriend" /></button>
      {/* 🔥 월 이동 버튼 + 제목 */}
      <div className="CalHeader">
        <button className="CalBtn" onClick={prevMonth}>«</button>

        <h2 className="CalTitle">
          {year}년 {month + 1}월
        </h2>

        <button className="CalBtn" onClick={nextMonth}>»</button>
      </div>

      {/* 요일 */}
      <div className="CalWeekdays">
        {["일", "월", "화", "수", "목", "금", "토"].map((w) => (
          <div key={w}>{w}</div>
        ))}
      </div>

      {/* 날짜 */}
      <div className="CalGrid">
        {days.map((day, index) => {
          const isToday =
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();

          const dateKey = day ? formatDate(year, month, day) : null;
          const isSelected = selectedDate === dateKey;

          return (
            <div
              key={index}
              className={`CalDay 
                ${day ? "" : "empty"} 
                ${isToday ? "today" : ""} 
                ${isSelected ? "selected" : ""}
              `}
              onClick={() => day && setSelectedDate(dateKey)}
            >
              {day && <span>{day}</span>}
            </div>
          );
        })}
      </div>

      {/* 기록 박스 → 날짜 선택 시만 표시 */}
      {selectedDate && (
        <div className="RecordBox">
          <button
            className={`RecordItem ${recordData[selectedDate]?.pill ? "checked" : ""}`}
            onClick={() => updateCheck("pill")}
          >
            <img src="/image/pill.png" alt="pill" />
            <span>오늘 드셔야 되는 약 복용하셨나요?</span>
            {recordData[selectedDate]?.pill && <span className="CheckMark">✓</span>}
          </button>

          <button
            className={`RecordItem ${recordData[selectedDate]?.supplement ? "checked" : ""}`}
            onClick={() => updateCheck("supplement")}
          >
            <img src="/image/supplement.png" alt="sup" />
            <span>아침에 영양제 드셨나요?</span>
            {recordData[selectedDate]?.supplement && <span className="CheckMark">✓</span>}
          </button>
        </div>
      )}
    </div>
  );
}
