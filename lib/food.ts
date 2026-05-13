export type ShelfLifeUnit = "天" | "月" | "年";

export type FoodItem = {
  id: number;
  name: string;
  category: string;
  productionDate: string;
  shelfLifeValue: number;
  shelfLifeUnit: ShelfLifeUnit;
  expiryDate: string;
  imageUrl: string | null;
  calories: number | null;
  protein: number | null;
  fat: number | null;
  carbs: number | null;
  sodium: number | null;
  note: string;
};

export type RecognizedFoodDraft = {
  name?: string;
  category?: string;
  productionDate?: string;
  shelfLifeValue?: number;
  shelfLifeUnit?: ShelfLifeUnit;
  expiryDate?: string;
  calories?: string;
  protein?: string;
  fat?: string;
  carbs?: string;
  sodium?: string;
  note?: string;
};

const MS_PER_DAY = 1000 * 60 * 60 * 24;
export const USER_FOODS_KEY = "fridge_user_foods";

export function safeDate(dateString: string): Date | null {
  const date = new Date(`${dateString}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function toDateInputValue(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function todayAtStart(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

export function getShelfLifeDays(value: number, unit: ShelfLifeUnit): number {
  if (!Number.isFinite(value) || value <= 0) return 1;
  if (unit === "月") return value * 30;
  if (unit === "年") return value * 365;
  return value;
}

export function addShelfLifeToProductionDate(productionDate: string, shelfLifeValue: number, shelfLifeUnit: ShelfLifeUnit): string {
  const base = safeDate(productionDate);
  if (!base || !Number.isFinite(shelfLifeValue) || shelfLifeValue <= 0) return productionDate;

  const result = new Date(base);
  if (shelfLifeUnit === "天") result.setDate(result.getDate() + shelfLifeValue);
  else if (shelfLifeUnit === "月") result.setMonth(result.getMonth() + shelfLifeValue);
  else result.setFullYear(result.getFullYear() + shelfLifeValue);
  return toDateInputValue(result);
}

export function getRemainingDays(expiryDate: string): number {
  const expiry = safeDate(expiryDate);
  if (!expiry) return 0;
  return Math.floor((expiry.getTime() - todayAtStart().getTime()) / MS_PER_DAY);
}

export function getProgressPercent(totalShelfLifeDays: number, remainingDays: number): number {
  if (!Number.isFinite(totalShelfLifeDays) || totalShelfLifeDays <= 0) return 0;
  if (!Number.isFinite(remainingDays)) return 0;
  return Math.max(0, Math.min(100, (remainingDays / totalShelfLifeDays) * 100));
}

export function getStatus(remainingDays: number) {
  if (remainingDays < 0) return { label: "已过期", tone: "expired" as const };
  if (remainingDays <= 1) return { label: "紧急", tone: "urgent" as const };
  if (remainingDays <= 3) return { label: "快临期", tone: "soon" as const };
  if (remainingDays <= 7) return { label: "注意", tone: "watch" as const };
  return { label: "安全", tone: "safe" as const };
}

export function getUserFoods(): FoodItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(USER_FOODS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveUserFood(food: FoodItem): void {
  if (typeof window === "undefined") return;
  const existing = getUserFoods();
  window.localStorage.setItem(USER_FOODS_KEY, JSON.stringify([food, ...existing]));
}

export function removeUserFood(foodId: number): void {
  if (typeof window === "undefined") return;
  const existing = getUserFoods();
  const filtered = existing.filter((item) => item.id !== foodId);
  window.localStorage.setItem(USER_FOODS_KEY, JSON.stringify(filtered));
}

export function findFoodById(foodId: number): { food: FoodItem | null; isUserFood: boolean } {
  const mockFood = mockFoods.find((item) => item.id === foodId);
  if (mockFood) return { food: mockFood, isUserFood: false };

  const userFood = getUserFoods().find((item) => item.id === foodId);
  if (userFood) return { food: userFood, isUserFood: true };

  return { food: null, isUserFood: false };
}

export function createFoodId(): number {
  return Date.now() + Math.floor(Math.random() * 1000);
}

export const mockFoods: FoodItem[] = [
  { id: 1, name: "鲜牛奶", category: "乳制品", productionDate: "2026-05-08", shelfLifeValue: 7, shelfLifeUnit: "天", expiryDate: "2026-05-15", imageUrl: null, calories: null, protein: null, fat: null, carbs: null, sodium: null, note: "开封后尽快饮用" },
  { id: 2, name: "原味酸奶", category: "乳制品", productionDate: "2026-05-05", shelfLifeValue: 14, shelfLifeUnit: "天", expiryDate: "2026-05-19", imageUrl: null, calories: null, protein: null, fat: null, carbs: null, sodium: null, note: "早餐搭配水果" },
  { id: 3, name: "鸡蛋", category: "蛋类", productionDate: "2026-05-01", shelfLifeValue: 21, shelfLifeUnit: "天", expiryDate: "2026-05-22", imageUrl: null, calories: null, protein: null, fat: null, carbs: null, sodium: null, note: "冷藏保存" },
  { id: 4, name: "草莓", category: "水果", productionDate: "2026-05-10", shelfLifeValue: 4, shelfLifeUnit: "天", expiryDate: "2026-05-14", imageUrl: null, calories: null, protein: null, fat: null, carbs: null, sodium: null, note: "易坏，优先食用" },
  { id: 5, name: "蓝莓", category: "水果", productionDate: "2026-05-09", shelfLifeValue: 7, shelfLifeUnit: "天", expiryDate: "2026-05-16", imageUrl: null, calories: null, protein: null, fat: null, carbs: null, sodium: null, note: "可做酸奶碗" },
  { id: 6, name: "鸡胸肉", category: "肉类", productionDate: "2026-05-07", shelfLifeValue: 5, shelfLifeUnit: "天", expiryDate: "2026-05-12", imageUrl: null, calories: null, protein: null, fat: null, carbs: null, sodium: null, note: "今晚做沙拉" },
  { id: 7, name: "北豆腐", category: "豆制品", productionDate: "2026-05-10", shelfLifeValue: 3, shelfLifeUnit: "天", expiryDate: "2026-05-13", imageUrl: null, calories: null, protein: null, fat: null, carbs: null, sodium: null, note: "可以做麻婆豆腐" },
  { id: 8, name: "全麦面包", category: "烘焙", productionDate: "2026-05-09", shelfLifeValue: 5, shelfLifeUnit: "天", expiryDate: "2026-05-14", imageUrl: null, calories: null, protein: null, fat: null, carbs: null, sodium: null, note: "早餐三明治" },
  { id: 9, name: "火腿片", category: "肉类", productionDate: "2026-05-03", shelfLifeValue: 10, shelfLifeUnit: "天", expiryDate: "2026-05-13", imageUrl: null, calories: null, protein: null, fat: null, carbs: null, sodium: null, note: "可煎可夹面包" },
  { id: 10, name: "芝士片", category: "乳制品", productionDate: "2026-04-20", shelfLifeValue: 1, shelfLifeUnit: "月", expiryDate: "2026-05-20", imageUrl: null, calories: null, protein: null, fat: null, carbs: null, sodium: null, note: "做焗饭备用" },
  { id: 11, name: "番茄酱", category: "酱料", productionDate: "2026-03-15", shelfLifeValue: 3, shelfLifeUnit: "月", expiryDate: "2026-06-15", imageUrl: null, calories: null, protein: null, fat: null, carbs: null, sodium: null, note: "开封后冷藏" },
  { id: 12, name: "宠物狗粮", category: "宠物食品", productionDate: "2026-01-01", shelfLifeValue: 6, shelfLifeUnit: "月", expiryDate: "2026-07-01", imageUrl: null, calories: null, protein: null, fat: null, carbs: null, sodium: null, note: "密封防潮" },
  { id: 13, name: "生菜", category: "蔬菜", productionDate: "2026-05-11", shelfLifeValue: 3, shelfLifeUnit: "天", expiryDate: "2026-05-14", imageUrl: null, calories: null, protein: null, fat: null, carbs: null, sodium: null, note: "先做轻食" },
  { id: 14, name: "菠菜", category: "蔬菜", productionDate: "2026-05-10", shelfLifeValue: 4, shelfLifeUnit: "天", expiryDate: "2026-05-14", imageUrl: null, calories: null, protein: null, fat: null, carbs: null, sodium: null, note: "焯水后食用" },
  { id: 15, name: "苹果", category: "水果", productionDate: "2026-05-01", shelfLifeValue: 21, shelfLifeUnit: "天", expiryDate: "2026-05-22", imageUrl: null, calories: null, protein: null, fat: null, carbs: null, sodium: null, note: "常温阴凉处" },
  { id: 16, name: "胡萝卜", category: "蔬菜", productionDate: "2026-05-02", shelfLifeValue: 20, shelfLifeUnit: "天", expiryDate: "2026-05-22", imageUrl: null, calories: null, protein: null, fat: null, carbs: null, sodium: null, note: "可炖汤" }
];
