import React, { useState } from "react";
import "./Calendar.css";

export default function Calendar() {
  // 친구추가 클릭 이벤트
  const handleAddFriend = () => {
    alert("친구 초대 기능 준비 중입니다! 😊");
  };

  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const [selectedDate, setSelectedDate] = useState(null);

  // 날짜별 체크 기록 저장
  const [recordData, setRecordData] = useState({});

  // 복용 항목 리스트
  const [recordItems, setRecordItems] = useState([
    { key: "pill", label: "오늘 드셔야 되는 약 복용하셨나요?", icon: "/image/pill.png" },
    { key: "supplement", label: "아침에 영양제 드셨나요?", icon: "/image/supplement.png" }
  ]);

  // 추가 모달
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemName, setNewItemName] = useState("");

  // 수정 모달
  const [showEditModal, setShowEditModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [editName, setEditName] = useState("");

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  // 날짜 리스트 생성
  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= lastDate; i++) days.push(i);

  // 날짜 key
  const formatDate = (y, m, d) => `${y}-${m + 1}-${d}`;

  // 체크 업데이트
  const updateCheck = (key) => {
    if (!selectedDate) return;
    setRecordData((prev) => ({
      ...prev,
      [selectedDate]: {
        ...prev[selectedDate],
        [key]: !prev[selectedDate]?.[key],
      },
    }));
  };

  // 항목 추가
  const addNewRecordItem = () => {
    if (!newItemName.trim()) return;

    const newKey = newItemName.replace(/\s+/g, "_");

    setRecordItems((prev) => [
      ...prev,
      {
        key: newKey,
        label: `${newItemName} 복용하셨나요?`,
        icon: "/image/pill.png",
      },
    ]);

    setShowAddModal(false);
    setNewItemName("");
  };

  // 항목 삭제
  const deleteItem = (deleteKey) => {
    setRecordItems((prev) => prev.filter((item) => item.key !== deleteKey));

    setRecordData((prev) => {
      const updated = {};
      Object.keys(prev).forEach((date) => {
        const { [deleteKey]: removed, ...rest } = prev[date];
        updated[date] = rest;
      });
      return updated;
    });
  };

  // 항목 수정
  const updateRecordItem = (key, newName) => {
    setRecordItems((prev) =>
      prev.map((item) =>
        item.key === key
          ? { ...item, label: `${newName} 복용하셨나요?` }
          : item
      )
    );
  };

  // 월 이동
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

      <button className="AddFriendButton" onClick={handleAddFriend}>
        <img src="/image/group.png" className="AddFriend" />
      </button>

      {/* 월 이동 */}
      <div className="CalHeader">
        <button className="CalBtn" onClick={prevMonth}>«</button>
        <h2 className="CalTitle">{year}년 {month + 1}월</h2>
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
          const dateKey = day ? formatDate(year, month, day) : null;
          const isSelected = selectedDate === dateKey;

          const isToday =
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();

          return (
            <div
              key={index}
              className={`CalDay ${day ? "" : "empty"} ${isToday ? "today" : ""} ${isSelected ? "selected" : ""}`}
              onClick={() => day && setSelectedDate(dateKey)}
            >
              {day && <span>{day}</span>}
            </div>
          );
        })}
      </div>

      {/* 기록 박스 */}
      {selectedDate && (
        <div className="RecordBox">
          {recordItems.map((item) => (
            <div key={item.key} className="RecordItemWrapper">

              {/* 체크 버튼 */}
              <button
                className={`RecordItem ${recordData[selectedDate]?.[item.key] ? "checked" : ""}`}
                onClick={() => updateCheck(item.key)}
              >
                <img src={item.icon} alt={item.key} />
                <span>{item.label}</span>
                {recordData[selectedDate]?.[item.key] && <span className="CheckMark">✓</span>}
              </button>

              {/* 오른쪽 수정 & 삭제 */}
              <div className="RightButtons">
                <button
                  className="EditBtn"
                  onClick={() => {
                    setEditItem(item);
                    setEditName(item.label.replace(" 복용하셨나요?", ""));
                    setShowEditModal(true);
                  }}
                >
                  ✎
                </button>

                <button className="DeleteBtn" onClick={() => deleteItem(item.key)}>
                  ✕
                </button>
              </div>
            </div>
          ))}

          {/* 추가 버튼 */}
          <button className="AddRecordButton" onClick={() => setShowAddModal(true)}>
            + 복용 약 추가하기
          </button>
        </div>
      )}

      {/* 추가 모달 */}
      {showAddModal && (
        <div className="ModalOverlay">
          <div className="ModalBox">
            <h3>추가할 약 이름</h3>

            <input
              type="text"
              className="ModalInput"
              placeholder="예: 비타민C"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
            />

            <div className="ModalButtons">
              <button className="ModalCancel" onClick={() => setShowAddModal(false)}>취소</button>
              <button className="ModalAdd" onClick={addNewRecordItem}>추가</button>
            </div>
          </div>
        </div>
      )}

      {/* 수정 모달 */}
      {showEditModal && (
        <div className="ModalOverlay">
          <div className="ModalBox">
            <h3>약 이름 수정</h3>

            <input
              type="text"
              className="ModalInput"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />

            <div className="ModalButtons">
              <button className="ModalCancel" onClick={() => setShowEditModal(false)}>취소</button>

              <button
                className="ModalAdd"
                onClick={() => {
                  updateRecordItem(editItem.key, editName);
                  setShowEditModal(false);
                }}
              >
                수정하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
