const fs = require('fs');

const keyMap = {
  "field1": "field1",
  "품목명": "product_name",
  "품목 영문명": "product_name_en",
  "업체명": "company_name",
  "업체 영문명": "company_name_en",
  "업허가번호": "license_number",
  "업일련번호": "serial_number",
  "업종": "category",
  "전문일반구분": "drug_type",
  "주성분": "ingredients",
  "주성분수": "ingredient_count",
  "큰제품이미지": "image_url",
  "신고허가구분": "approval_type",
  "취소/취하일자": "cancel_withdraw_date",
  "취소/취하구분": "cancel_withdraw_type",
  "분류명": "classification",
  "품목허가번호": "product_license_no",
  "보험코드": "insurance_code",
  "사업자번호": "business_number",
  "품목허가일자": "product_license_date"
};

let unknownCount = 1;

function cleanKey(key) {
  if (keyMap[key]) return keyMap[key];

  let cleaned = key
    .replace(/[^\w\s]/gi, '')  // 특수문자 제거
    .replace(/\s+/g, '_')      // 공백 → _
    .toLowerCase();

  cleaned = cleaned.trim();

  if (cleaned === "") cleaned = `field_${unknownCount++}`;

  return cleaned;
}

function convert(inputFile, outputFile) {
  const jsonData = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
  const writeStream = fs.createWriteStream(outputFile);

  jsonData.forEach(item => {
    const cleaned = {};
    for (const key in item) {
      cleaned[cleanKey(key)] = item[key];
    }
    writeStream.write(JSON.stringify(cleaned) + "\n");
  });

  writeStream.end();
  console.log("완료! 변환된 파일:", outputFile);
}

convert("drugs.json", "drugs_clean.jsonl");
