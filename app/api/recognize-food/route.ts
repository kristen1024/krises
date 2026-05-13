import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    name: "草莓酸奶",
    category: "乳制品",
    productionDate: "2026-05-10",
    shelfLifeValue: 21,
    shelfLifeUnit: "天",
    expiryDate: "2026-05-31",
    calories: "89 kcal/100g",
    protein: "3.1g",
    fat: "2.7g",
    carbs: "12.4g",
    sodium: "65mg",
    note: "AI 识别示例：请人工确认日期和保质期。"
  });
}
