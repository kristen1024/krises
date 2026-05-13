"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { addShelfLifeToProductionDate, createFoodId, FoodItem, RecognizedFoodDraft, saveUserFood, ShelfLifeUnit } from "@/lib/food";

type FormState = Omit<FoodItem, "id">;

const defaultForm: FormState = { name: "", category: "", productionDate: "", shelfLifeValue: 1, shelfLifeUnit: "天", expiryDate: "", imageUrl: "", calories: null, protein: null, fat: null, carbs: null, sodium: null, note: "" };

const parseNutritionNumber = (value?: string) => {
  if (!value) return null;
  const matched = value.match(/[\d.]+/);
  return matched ? Number(matched[0]) : null;
};

export default function FoodForm({ recognizedDraft }: { recognizedDraft?: RecognizedFoodDraft | null }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(defaultForm);
  const [errors, setErrors] = useState<string[]>([]);
  const [isExpiryManuallyEdited, setIsExpiryManuallyEdited] = useState(false);

  useEffect(() => {
    if (!recognizedDraft) return;
    setForm((prev) => ({
      ...prev,
      name: recognizedDraft.name ?? prev.name,
      category: recognizedDraft.category ?? prev.category,
      productionDate: recognizedDraft.productionDate ?? prev.productionDate,
      shelfLifeValue: recognizedDraft.shelfLifeValue ?? prev.shelfLifeValue,
      shelfLifeUnit: (recognizedDraft.shelfLifeUnit as ShelfLifeUnit) ?? prev.shelfLifeUnit,
      expiryDate: recognizedDraft.expiryDate ?? prev.expiryDate,
      calories: parseNutritionNumber(recognizedDraft.calories),
      protein: parseNutritionNumber(recognizedDraft.protein),
      fat: parseNutritionNumber(recognizedDraft.fat),
      carbs: parseNutritionNumber(recognizedDraft.carbs),
      sodium: parseNutritionNumber(recognizedDraft.sodium),
      note: recognizedDraft.note ?? prev.note
    }));
    setIsExpiryManuallyEdited(true);
  }, [recognizedDraft]);

  useEffect(() => {
    if (!form.productionDate || isExpiryManuallyEdited) return;
    setForm((prev) => ({ ...prev, expiryDate: addShelfLifeToProductionDate(prev.productionDate, prev.shelfLifeValue, prev.shelfLifeUnit) }));
  }, [form.productionDate, form.shelfLifeValue, form.shelfLifeUnit, isExpiryManuallyEdited]);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((prev) => ({ ...prev, [key]: value }));

  const validate = () => {
    const nextErrors: string[] = [];
    if (!form.name.trim()) nextErrors.push("请填写食品名称");
    if (!form.category.trim()) nextErrors.push("请填写类别");
    if (!form.productionDate) nextErrors.push("请选择生产日期");
    if (!Number.isFinite(form.shelfLifeValue) || form.shelfLifeValue <= 0) nextErrors.push("保质期数字需大于 0");
    if (!form.expiryDate) nextErrors.push("请填写到期日期");
    setErrors(nextErrors);
    return nextErrors.length === 0;
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    saveUserFood({ id: createFoodId(), ...form, imageUrl: form.imageUrl || null });
    router.push("/");
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      {recognizedDraft && <p className="rounded-xl bg-yellow-50 p-3 text-sm text-yellow-800">AI 识别可能有误，请确认生产日期、保质期和到期日期后再保存。</p>}
      {errors.length > 0 && <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{errors.map((error) => <p key={error}>• {error}</p>)}</div>}
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 space-y-3">
        <input className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="食品名称 *" value={form.name} onChange={(e) => setField("name", e.target.value)} />
        <input className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="类别 *（例如：乳制品）" value={form.category} onChange={(e) => setField("category", e.target.value)} />
        <input type="date" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" value={form.productionDate} onChange={(e) => { setIsExpiryManuallyEdited(false); setField("productionDate", e.target.value); }} />
        <div className="grid grid-cols-2 gap-2">
          <input type="number" min={1} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" value={form.shelfLifeValue} onChange={(e) => { setIsExpiryManuallyEdited(false); setField("shelfLifeValue", Number(e.target.value)); }} />
          <select className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" value={form.shelfLifeUnit} onChange={(e) => { setIsExpiryManuallyEdited(false); setField("shelfLifeUnit", e.target.value as ShelfLifeUnit); }}><option value="天">天</option><option value="月">月</option><option value="年">年</option></select>
        </div>
        <input type="date" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" value={form.expiryDate} onChange={(e) => { setIsExpiryManuallyEdited(true); setField("expiryDate", e.target.value); }} />
        <input className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="图片 URL（可选）" value={form.imageUrl ?? ""} onChange={(e) => setField("imageUrl", e.target.value)} />
        <textarea className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" rows={3} placeholder="备注（可选）" value={form.note} onChange={(e) => setField("note", e.target.value)} />
      </div>
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5"><p className="mb-2 text-sm font-medium">营养信息（可选）</p><div className="grid grid-cols-2 gap-2">{(["calories", "protein", "fat", "carbs", "sodium"] as const).map((field) => <input key={field} type="number" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder={field} value={form[field] ?? ""} onChange={(e) => setField(field, e.target.value ? Number(e.target.value) : null)} />)}</div></div>
      <div className="grid grid-cols-2 gap-3"><button type="button" onClick={() => router.push("/")} className="rounded-xl bg-slate-200 px-3 py-3 text-sm font-medium text-slate-700">取消</button><button type="submit" className="rounded-xl bg-ink px-3 py-3 text-sm font-medium text-white">保存食品</button></div>
    </form>
  );
}
