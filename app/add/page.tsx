"use client";

import { useState } from "react";
import FoodForm from "@/components/FoodForm";
import ImageRecognizePanel from "@/components/ImageRecognizePanel";
import { RecognizedFoodDraft } from "@/lib/food";

export default function AddFoodPage() {
  const [recognizedDraft, setRecognizedDraft] = useState<RecognizedFoodDraft | null>(null);

  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-4 pb-8 pt-6">
      <section className="mb-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
        <h1 className="text-3xl font-bold tracking-tight">添加食品</h1>
        <p className="mt-2 text-sm text-slate-600">先手动记录食品信息，后续可以接入拍照识别。</p>
      </section>

      <ImageRecognizePanel onRecognized={setRecognizedDraft} />
      <FoodForm recognizedDraft={recognizedDraft} />
    </main>
  );
}
