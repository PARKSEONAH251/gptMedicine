const fs = require("fs");
const iconv = require("iconv-lite");
const csv = require("csvtojson");

const inputFile = "OpenData_ItemPermitC20251126.csv";

// 1) 스트림 기반으로 CP949 → UTF-8 변환
const readStream = fs.createReadStream(inputFile)
  .pipe(iconv.decodeStream("CP949"))      // CP949로 디코딩
  .pipe(iconv.encodeStream("UTF-8"));     // UTF-8로 재인코딩

const tempFile = "converted_utf8.csv";

// 2) 변환된 파일 저장
const writeStream = fs.createWriteStream(tempFile);

readStream.pipe(writeStream);

writeStream.on("finish", () => {
  console.log("🟢 인코딩 변환 완료 → converted_utf8.csv 생성됨");

  // 3) 이제 CSV → JSON
  csv()
    .fromFile(tempFile)
    .then((jsonObj) => {
      fs.writeFileSync("drugs.json", JSON.stringify(jsonObj, null, 2), "utf8");
      console.log("🎉 CSV → JSON 변환 성공!");
    })
    .catch((err) => console.error("❌ CSV 파싱 오류:", err));
});
