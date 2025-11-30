import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Calendar.css";

export default function Calendar() {
  const navigate = useNavigate();

  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const [selectedDate, setSelectedDate] = useState(null);

  // 날짜별 체크 기록
  const [recordData, setRecordData] = useState({});

  // 약 리스트 (startDate + endDate 포함)
  const [recordItems, setRecordItems] = useState([
    {
      key: "pill",
      label: "오늘 드셔야 되는 약 복용하셨나요?",
      icon: "/image/pill.png",
      startDate: null,
      endDate: null,
    },
    {
      key: "supplement",
      label: "아침에 영양제 드셨나요?",
      icon: "/image/supplement.png",
      startDate: null,
      endDate: null,
    },
  ]);

  // 추가 모달 입력값
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemStartDate, setNewItemStartDate] = useState("");
  const [newItemEndDate, setNewItemEndDate] = useState("");

  // 수정 모달 입력값
  const [showEditModal, setShowEditModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [editName, setEditName] = useState("");
  const [editStartDate, setEditStartDate] = useState("");
  const [editEndDate, setEditEndDate] = useState("");

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  // 날짜 리스트 생성
  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= lastDate; i++) days.push(i);

  // 날짜 Key generator
  const formatDate = (y, m, d) => `${y}-${m + 1}-${d}`;

  // 체크 토글
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

  // 약 추가하기
  const addNewRecordItem = () => {
    if (!newItemName.trim()) return alert("약 이름을 입력해주세요.");
    if (!newItemStartDate) return alert("복용 시작일을 선택해주세요.");
    if (!newItemEndDate) return alert("복용 종료일을 선택해주세요.");

    const newKey = newItemName.replace(/\s+/g, "_");

    setRecordItems((prev) => [
      ...prev,
      {
        key: newKey,
        label: `${newItemName} 복용하셨나요?`,
        icon: "/image/pill.png",
        startDate: newItemStartDate,
        endDate: newItemEndDate,
      },
    ]);

    setShowAddModal(false);
    setNewItemName("");
    setNewItemStartDate("");
    setNewItemEndDate("");
  };

  // 약 삭제하기
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

  // 약 수정하기
  const updateRecordItem = (key, newName, newStartDate, newEndDate) => {
    setRecordItems((prev) =>
      prev.map((item) =>
        item.key === key
          ? {
              ...item,
              label: `${newName} 복용하셨나요?`,
              startDate: newStartDate,
              endDate: newEndDate,
            }
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

      <button className="AddFriendButton" onClick={() => navigate("/onboarding")}>
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

      {/* 선택 날짜의 기록 */}
      {selectedDate && (
        <div className="RecordBox">
          {recordItems.map((item) => (
            <div key={item.key} className="RecordItemWrapper">
              <button
                className={`RecordItem ${recordData[selectedDate]?.[item.key] ? "checked" : ""}`}
                onClick={() => updateCheck(item.key)}
              >
                <img src={item.icon} alt={item.key} />
                <span>{item.label}</span>

                {/* 기간 표시 */}
                {(item.startDate || item.endDate) && (
                  <span className="EndDateLabel">
                    {item.startDate} ~ {item.endDate}
                  </span>
                )}

                {recordData[selectedDate]?.[item.key] && <span className="CheckMark">✓</span>}
              </button>

              <div className="RightButtons">
                <button
                  className="EditBtn"
                  onClick={() => {
                    setEditItem(item);
                    setEditName(item.label.replace(" 복용하셨나요?", ""));
                    setEditStartDate(item.startDate || "");
                    setEditEndDate(item.endDate || "");
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

          <button className="AddRecordButton" onClick={() => setShowAddModal(true)}>
            + 복용 약 추가하기
          </button>

          <button className="AlarmButton" onClick={() => navigate("/alarm")}>
            복용약 알림 설정
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

            <h4>언제부터 복용하나요?</h4>
            <input
              type="date"
              className="ModalInput"
              value={newItemStartDate}
              onChange={(e) => setNewItemStartDate(e.target.value)}
            />

            <h4>언제까지 복용하나요?</h4>
            <input
              type="date"
              className="ModalInput"
              value={newItemEndDate}
              onChange={(e) => setNewItemEndDate(e.target.value)}
            />

            <div className="ModalButtons">
              <button className="ModalCancel" onClick={() => setShowAddModal(false)}>
                취소
              </button>
              <button className="ModalAdd" onClick={addNewRecordItem}>
                추가
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 수정 모달 */}
      {showEditModal && (
        <div className="ModalOverlay">
          <div className="ModalBox">
            <h3>약 정보 수정</h3>

            <input
              type="text"
              className="ModalInput"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />

            <h4>복용 시작일</h4>
            <input
              type="date"
              className="ModalInput"
              value={editStartDate}
              onChange={(e) => setEditStartDate(e.target.value)}
            />

            <h4>복용 종료일</h4>
            <input
              type="date"
              className="ModalInput"
              value={editEndDate}
              onChange={(e) => setEditEndDate(e.target.value)}
            />

            <div className="ModalButtons">
              <button className="ModalCancel" onClick={() => setShowEditModal(false)}>
                취소
              </button>

              <button
                className="ModalAdd"
                onClick={() => {
                  updateRecordItem(editItem.key, editName, editStartDate, editEndDate);
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
