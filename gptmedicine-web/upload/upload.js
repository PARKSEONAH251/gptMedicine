const admin = require("firebase-admin");
const fs = require("fs");

// JSON 데이터 불러오기
const data = require("./drugs.json");

// Firebase Admin 초기화
admin.initializeApp({
  credential: admin.credential.cert(require("./gptmedical-firebase-adminsdk-fbsvc-8fe2489310.json"))
});

// Firestore 인스턴스
const db = admin.firestore();
const collection = db.collection("drugs");

// 🔥 문서 ID로 사용할 컬럼 → field1 확정!
const KEY_NAME = "field1";

async function upload() {
  console.log("⏳ Firestore 업로드 시작...");

  let count = 0;

  for (const item of data) {
    const docId = item[KEY_NAME];

    if (!docId) {
      console.warn("⚠️ field1 없음 → 스킵됨:", item);
      continue;
    }

    await collection.doc(String(docId)).set(item);
    count++;
  }

  console.log(`🎉 Firestore 업로드 완료! 총 ${count}개 문서 저장됨`);
  process.exit();
}

upload().catch(console.error);
