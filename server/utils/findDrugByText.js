import fs from "fs";
import path from "path";

const drugDB = JSON.parse(
  fs.readFileSync(
    path.join(process.cwd(), "data/drugData.json"),
    "utf-8"
  )
);

export function findDrugByText(text) {
  if (!text) return null;

  return drugDB.find(d =>
    text.includes(d["품목명"]) ||
    text.includes(d["주성분"])
  ) || null;
}
