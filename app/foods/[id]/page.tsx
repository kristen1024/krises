"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import { findFoodById, getProgressPercent, getRemainingDays, getShelfLifeDays, getStatus, removeUserFood } from "@/lib/food";

const statusStyleMap = {
  expired: "bg-slate-200 text-slate-700",
  urgent: "bg-red-100 text-red-700",
  soon: "bg-orange-100 text-orange-700",
  watch: "bg-yellow-100 text-yellow-700",
  safe: "bg-green-100 text-green-700"
};

export default function FoodDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const foodId = Number(params.id);

  const { food, isUserFood } = useMemo(() => findFoodById(foodId), [foodId]);

  if (!food) {
    return (
      <main className="mx-auto min-h-screen w-full max-w-md px-4 pb-8 pt-6">
        <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 space-y-3">
          <h1 className="text-2xl font-bold">没有找到这个食品</h1>
          <Link href="/" className="inline-block rounded-xl bg-ink px-3 py-2 text-sm font-medium text-white">返回首页</Link>
        </section>
      </main>
    );
  }

  const remainingDays = getRemainingDays(food.expiryDate);
  const progressPercent = getProgressPercent(getShelfLifeDays(food.shelfLifeValue, food.shelfLifeUnit), remainingDays);
  const status = getStatus(remainingDays);

  const handleDelete = (actionText: "删除" | "已吃完") => {
    if (!isUserFood) {
      window.alert(actionText === "删除" ? "默认示例食品暂时不能删除" : "默认示例食品暂时不能标记");
      return;
    }

    const message = actionText === "删除" ? "确定要删除这个食品吗？" : "确定标记为已吃完吗？";
    if (!window.confirm(message)) return;

    removeUserFood(food.id);
    router.push("/");
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-4 pb-8 pt-6 space-y-3">
      <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
        <h1 className="text-3xl font-bold tracking-tight">{food.name}</h1>
        <p className="mt-2 text-sm text-slate-600">食品详情信息</p>
      </section>

      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">状态</p>
          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyleMap[status.tone]}`}>{status.label}</span>
        </div>
        <dl className="grid grid-cols-2 gap-y-1 text-sm text-slate-600">
          <div><dt className="inline">类别：</dt><dd className="inline">{food.category}</dd></div>
          <div><dt className="inline">生产日期：</dt><dd className="inline">{food.productionDate}</dd></div>
          <div><dt className="inline">保质期：</dt><dd className="inline">{food.shelfLifeValue}{food.shelfLifeUnit}</dd></div>
          <div><dt className="inline">到期日期：</dt><dd className="inline">{food.expiryDate}</dd></div>
          <div className="col-span-2"><dt className="inline">剩余天数：</dt><dd className="inline">{remainingDays} 天</dd></div>
        </dl>
        <div><div className="mb-1 flex justify-between text-xs text-slate-500"><span>倒计时进度</span><span>{Math.round(progressPercent)}%</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-mint" style={{ width: `${progressPercent}%` }} /></div></div>
      </section>

      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
        <p className="mb-2 text-sm font-medium">图片</p>
        {food.imageUrl ? (
          <Image src={food.imageUrl} alt={food.name} width={500} height={300} className="h-40 w-full rounded-xl object-cover" />
        ) : (
          <div className="flex h-32 items-center justify-center rounded-xl bg-slate-100 text-sm text-slate-500">暂未添加图片</div>
        )}
      </section>

      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
        <p className="mb-2 text-sm font-medium">营养信息</p>
        {food.calories === null && food.protein === null && food.fat === null && food.carbs === null && food.sodium === null ? (
          <p className="text-sm text-slate-500">暂未添加营养信息</p>
        ) : (
          <dl className="grid grid-cols-2 gap-y-1 text-sm text-slate-600">
            <div><dt className="inline">热量：</dt><dd className="inline">{food.calories ?? "-"}</dd></div>
            <div><dt className="inline">蛋白质：</dt><dd className="inline">{food.protein ?? "-"}</dd></div>
            <div><dt className="inline">脂肪：</dt><dd className="inline">{food.fat ?? "-"}</dd></div>
            <div><dt className="inline">碳水：</dt><dd className="inline">{food.carbs ?? "-"}</dd></div>
            <div className="col-span-2"><dt className="inline">钠：</dt><dd className="inline">{food.sodium ?? "-"}</dd></div>
          </dl>
        )}
      </section>

      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
        <p className="mb-2 text-sm font-medium">备注</p>
        <p className="text-sm text-slate-600">{food.note || "暂无备注"}</p>
      </section>

      <div className="grid grid-cols-3 gap-2">
        <Link href="/" className="rounded-xl bg-slate-200 px-3 py-3 text-center text-sm font-medium text-slate-700">返回首页</Link>
        <button onClick={() => handleDelete("已吃完")} className="rounded-xl bg-green-100 px-3 py-3 text-sm font-medium text-green-800">已吃完</button>
        <button onClick={() => handleDelete("删除")} className="rounded-xl bg-red-100 px-3 py-3 text-sm font-medium text-red-700">删除食品</button>
      </div>
    </main>
  );
}
