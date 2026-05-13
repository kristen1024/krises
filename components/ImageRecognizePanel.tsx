"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { RecognizedFoodDraft } from "@/lib/food";

export default function ImageRecognizePanel({ onRecognized }: { onRecognized: (draft: RecognizedFoodDraft) => void }) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const previewUrl = useMemo(() => (imageFile ? URL.createObjectURL(imageFile) : ""), [imageFile]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleRecognize = async () => {
    setError("");
    if (!imageFile) return setError("请先上传食品包装图片");

    try {
      setLoading(true);
      const response = await fetch("/api/recognize-food", { method: "POST" });
      if (!response.ok) throw new Error("bad response");
      onRecognized((await response.json()) as RecognizedFoodDraft);
    } catch {
      setError("识别失败，请手动填写或稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mb-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 space-y-3">
      <h2 className="text-base font-semibold">拍照识别食品信息</h2>
      <p className="text-sm text-slate-600">上传食品包装图，系统会尝试识别生产日期、保质期和营养信息。</p>
      <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} className="w-full text-sm" />
      {previewUrl ? <Image src={previewUrl} alt="食品预览" width={320} height={180} className="h-36 w-full rounded-xl object-cover" unoptimized /> : <div className="flex h-24 items-center justify-center rounded-xl bg-slate-100 text-sm text-slate-500">暂未选择图片</div>}
      {error && <p className="rounded-xl bg-red-50 p-2 text-sm text-red-700">{error}</p>}
      <button onClick={handleRecognize} disabled={loading} className="w-full rounded-xl bg-peach px-3 py-3 text-sm font-medium text-ink disabled:opacity-60">{loading ? "识别中..." : "AI 识别"}</button>
    </section>
  );
}
