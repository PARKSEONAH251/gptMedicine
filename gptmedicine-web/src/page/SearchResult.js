import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { askGPT } from "../api/gpt";
import "./SearchResult.css";

export default function SearchResult() {
    const location = useLocation();
    const query = new URLSearchParams(location.search).get("query");

    const [loading, setLoading] = useState(true);
    const [answer, setAnswer] = useState("");

    const hasCalled = useRef(false);

    // 아이콘 매핑
    const iconMap = {
        "1": "💊",
        "2": "🌿",
        "3": "⭐",
        "4": "📌",
        "5": "⚠️",
        "6": "🚫",
        "7": "🔍",
        "8": "📝"
    };

    const formatGPTText = (text) => {
        return text
            // 1~8 아이콘은 제목에서만 붙이기
            .replace(/^1\)/gm, "1)")
            .replace(/^2\)/gm, "2)")
            .replace(/^3\)/gm, "3)")
            .replace(/^4\)/gm, "4)")
            .replace(/^5\)/gm, "5)")
            .replace(/^6\)/gm, "6)")
            .replace(/^7\)/gm, "7)")
            .replace(/^8\)/gm, "8)")

            // 🧹 본문 내부의 이모지 제거
            .replace(/[⚠️⭐🌿💊📌🚫🔍📝✨🔥👉🌟]+/g, "")

            // 리스트 점 스타일 통일
            .replace(/- /g, "• ");
    };


    useEffect(() => {
        const fetchResult = async () => {
            if (!query) return;
            if (hasCalled.current) return;
            hasCalled.current = true;

            const res = await askGPT(query);
            const formatted = formatGPTText(res);
            setAnswer(formatted);
            setLoading(false);
        };

        fetchResult();
    }, [query]);

    // 섹션 분리 (1), 2), 3) … 기준 split)
    const sections = answer.split(/(?=\d\))/g).filter((s) => s.trim() !== "");

    return (
        <div className="ResultContainer">
            <p className="ResultTitle"></p>

            {loading ? (
                <div className="LoadingBox">
                    <div className="Spinner"></div>
                    <p className="LoadingText">의약품 정보를 분석 중입니다...</p>
                </div>
            ) : (
                <div className="ResultBox">
                    {sections.map((sec, index) => {
                        // 제목(1) 약 소개) 추출
                        const titleMatch = sec.match(/^(\d\)\s*.*?)(?:\n|$)/);
                        const title = titleMatch ? titleMatch[1] : "";

                        // 본문
                        const content = sec.replace(title, "").trim();

                        const num = title.charAt(0);
                        const icon = iconMap[num] || "💊";

                        return (
                            <div className="section-card" key={index}>
                                {/* 왼쪽 아이콘 */}
                                <div className="icon-bubble">{icon}</div>

                                <div className="bubble-box">
                                    <p className="bubble-title">{title}</p>

                                    <div className="bubble-content">
                                        <ReactMarkdown>{content}</ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
