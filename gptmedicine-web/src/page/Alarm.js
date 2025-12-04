import React, { useState, useEffect } from "react";
import "./Alarm.css";

export default function Alarm() {
    const [alarms, setAlarms] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        title: "",
        time: "",
        supplements: ""
    });

    /** 🔥 localStorage에서 초기값 불러오기 */
    useEffect(() => {
        const saved = localStorage.getItem("alarms");
        if (saved) {
            setAlarms(JSON.parse(saved));
        }
    }, []);

    /** 🔥 alarms 변화 시 localStorage에 저장 */
    useEffect(() => {
        localStorage.setItem("alarms", JSON.stringify(alarms));
    }, [alarms]);

    /** 입력 변경 */
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    /** 🔥 모달 열기 (+ 또는 수정) */
    const openModal = (alarm = null) => {
        if (alarm) {
            setEditingId(alarm.id);
            setForm({
                title: alarm.title,
                time: alarm.time,
                supplements: alarm.supplements.join(", ")
            });
        } else {
            setEditingId(null);
            setForm({ title: "", time: "", supplements: "" });
        }
        setIsModalOpen(true);
    };

    /** 🔥 저장 (추가 or 수정) */
    const handleSave = () => {
        if (!form.title || !form.time) {
            alert("제목과 시간을 입력해주세요!");
            return;
        }

        const supplements = form.supplements
            ? form.supplements.split(",").map((t) => t.trim())
            : [];

        if (editingId) {
            // 수정
            const updated = alarms.map((a) =>
                a.id === editingId
                    ? { ...a, title: form.title, time: form.time, supplements }
                    : a
            );
            setAlarms(updated);
        } else {
            // 추가
            const newAlarm = {
                id: Date.now(),
                title: form.title,
                time: form.time,
                supplements,
            };
            setAlarms([...alarms, newAlarm]);
        }

        setIsModalOpen(false);
    };

    /** 🔥 삭제 기능 */
    const handleDelete = (id) => {
        const filtered = alarms.filter((a) => a.id !== id);
        setAlarms(filtered);
    };

    return (
        <div className="alarm-container">

            {/* 🔥 모달 팝업 */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h3>{editingId ? "알람 수정" : "알람 추가"}</h3>

                        <input
                            name="title"
                            className="input-field"
                            placeholder="알람 제목"
                            value={form.title}
                            onChange={handleChange}
                        />

                        <input
                            name="time"
                            type="time"
                            className="input-field"
                            value={form.time}
                            onChange={handleChange}
                        />

                        <input
                            name="supplements"
                            className="input-field"
                            placeholder="영양제 (쉼표로 구분)"
                            value={form.supplements}
                            onChange={handleChange}
                        />

                        <div className="btn-row">
                            <button className="cancel-btn" onClick={() => setIsModalOpen(false)}>
                                취소
                            </button>
                            <button className="save-btn" onClick={handleSave}>
                                저장
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 알람 리스트 */}
            {alarms.length > 0 && (
                <div className="alarm-list">
                    {alarms.map((item) => (
                        <div key={item.id} className="alarm-card">
                            <div className="alarm-row">
                                <p className="alarm-title">{item.title}</p>

                                <div className="alarm-time-badge">{item.time}</div>
                            </div>

                            {item.supplements.length > 0 && (
                                <p className="alarm-sub">• {item.supplements.join(" • ")}</p>
                            )}

                            {/* 수정/삭제 버튼 */}
                            <div className="edit-row">
                                <button className="edit-btn" onClick={() => openModal(item)}>
                                    수정
                                </button>
                                <button className="delete-btn" onClick={() => handleDelete(item.id)}>
                                    삭제
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* + 버튼 */}
            <button className="alarm-add-btn" onClick={() => openModal()}>
                +
            </button>

            {/* 알람 없음 화면 */}
            {alarms.length === 0 && (
                <div className="empty-view">
                    <img src="/image/warning.png" className="empty-icon" alt="empty" />
                    <p>즐겨찾기한 데이터가<br />현재 없습니다.</p>
                </div>
            )}
        </div>
    );
}
