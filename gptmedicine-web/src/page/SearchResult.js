import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import "./SearchResult.css";

export default function SearchResult() {
    const navigate = useNavigate();
    const location = useLocation();

    const query = new URLSearchParams(location.search).get("query");

    const [loading, setLoading] = useState(true);
    const [answer, setAnswer] = useState("");

    const hasCalled = useRef(false);
    const [input, setInput] = useState("");

    //🔍 검색 실행
    const handleSearch = () => {
        if (!input.trim()) {
            alert("궁금하신 내용을 입력하세요!");
            return;
        }

        setAnswer("");
        setLoading(true);
        hasCalled.current = false;

        navigate(`/search?query=${encodeURIComponent(input)}`);
    };

    // 아이콘 매핑
    const iconMap = {
        "1": "💊",
        "2": "🌿",
        "3": "⭐",
        "4": "📌",
        "5": "⚠️",
        "6": "🚫",
        "7": "🔍",
        "8": "📝",
    };

    // GPT 텍스트 포맷터
    const formatGPTText = (text) => {
        if (!text) return "";

        return text
            .replace(/[⚠️⭐🌿💊📌🚫🔍📝✨🔥👉🌟]+/g, "")
            .replace(/- /g, "• ")
            .replace(/^\s+/gm, "")
            .trim();
    };


    // ⭐ 핵심: 로컬 서버 API 호출 (http://localhost:4000)
    useEffect(() => {
        const fetchResult = async () => {
            if (!query) return;
            if (hasCalled.current) return;

            hasCalled.current = true;

            try {
                const res = await fetch("http://localhost:4000/api/medicines/analyze", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ text: query }),
                });

                if (!res.ok) {
                    throw new Error("서버 응답 실패");
                }

                const data = await res.json();

                const finalText =
                    data.finalAnalysis ||
                    data.combinedInteraction ||
                    "결과를 불러올 수 없습니다.";

                setAnswer(formatGPTText(finalText));
            } catch (error) {
                console.error("SearchResult 오류:", error);
                setAnswer("오류가 발생했습니다. 다시 시도해주세요.");
            }

            setLoading(false);
        };

        fetchResult();
    }, [query]);


    //📌 모드 감지 (A / B / C)
    const mode =
        answer.startsWith("1)") ? "A" :
        answer.includes("📌 증상 분류") ? "B" :
        answer.startsWith("📌 약 이름") ? "C" : "A";

    const cleanAnswer = answer.replace(/^\[[A-C]\]\s*/, "");

    //🧩 A 모드 → 1~8 항목 분리
    const sections = cleanAnswer
        .split(/(?=\d\))/g)
        .filter((s) => s.trim() !== "");

    return (
        <div className="AppWrapper">
            <div className="ResultContainer">
                <img
                    src="/image/mini_pattern.png"
                    className="Search-Primary-Patterntopimage"
                />
                <img
                    src="/image/Primary_Pattern.png"
                    className="Search-Primary-PatternBottonimage"
                />

                {/* 로딩화면 */}
                {loading ? (
                    <div className="LoadingBox">
                        <img
                            src="/image/loadingpattern.png"
                            alt="loading"
                            className="LoadingImage"
                        />
                        <p className="LoadingText">
                            의약품 정보를 분석 중입니다...
                        </p>
                    </div>
                ) : (
                    <>
                        {/* 🟥 A 모드 */}
                        {mode === "A" && (
                            <div className="A-ModeWrapper">
                                <div className="ResultBox">
                                    {sections.map((sec, index) => {
                                        const titleMatch = sec.match(
                                            /^(\d\)\s*.*?)(?:\n|$)/
                                        );
                                        const title = titleMatch
                                            ? titleMatch[1]
                                            : "";
                                        const content = sec
                                            .replace(title, "")
                                            .trim();

                                        const num = title.charAt(0);
                                        const icon =
                                            iconMap[num] || "💊";

                                        return (
                                            <div
                                                className="section-card"
                                                key={index}
                                            >
                                                <div className="icon-bubble">
                                                    {icon}
                                                </div>
                                                <div className="bubble-box">
                                                    <p className="bubble-title">
                                                        {title}
                                                    </p>
                                                    <div className="bubble-content">
                                                        <ReactMarkdown>
                                                            {content}
                                                        </ReactMarkdown>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* 🟩 B 모드 */}
                        {mode === "B" && (
                            <div className="SimpleBox">
                                <ReactMarkdown>{cleanAnswer}</ReactMarkdown>
                            </div>
                        )}

                        {/* 🟨 C 모드 */}
                        {mode === "C" && (
                            <div className="SimpleBox">
                                <ReactMarkdown>{cleanAnswer}</ReactMarkdown>
                            </div>
                        )}
                    </>
                )}

                {/* 검색창 */}
                <div className="ResultSearchWrapper">
                    <div className="Result-SearchBox">
                        <input
                            type="text"
                            className="SearchInput"
                            placeholder="궁금한 내용을 입력하세요"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === "Enter" && handleSearch()
                            }
                        />
                        <button className="VoiceButton">
                            <img src="/image/voice.png" alt="Voice" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
