"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import CountdownCard from "@/components/CountdownCard";
import { FoodItem, getRemainingDays, getUserFoods, mockFoods } from "@/lib/food";

type SortType = "soonest" | "latest";
const PAGE_SIZE = 8;

export default function HomePage() {
  const [sortType, setSortType] = useState<SortType>("soonest");
  const [page, setPage] = useState(1);
  const [foods, setFoods] = useState<FoodItem[]>(mockFoods);

  useEffect(() => {
    const userFoods = getUserFoods();
    setFoods([...mockFoods, ...userFoods]);
  }, []);

  const sortedFoods = useMemo(() => {
    const list = [...foods];
    list.sort((a, b) => {
      const dayA = getRemainingDays(a.expiryDate);
      const dayB = getRemainingDays(b.expiryDate);
      return sortType === "soonest" ? dayA - dayB : dayB - dayA;
    });
    return list;
  }, [foods, sortType]);

  const totalItems = sortedFoods.length;
  const urgentIn3Days = sortedFoods.filter((item) => {
    const days = getRemainingDays(item.expiryDate);
    return days >= 0 && days <= 3;
  }).length;
  const expiredCount = sortedFoods.filter((item) => getRemainingDays(item.expiryDate) < 0).length;

  const totalPages = Math.max(1, Math.ceil(sortedFoods.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pagedFoods = sortedFoods.slice(start, start + PAGE_SIZE);

  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-4 pb-8 pt-6">
      <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-3xl font-bold tracking-tight">我的冰箱</h1>
          <Link href="/add" className="rounded-xl bg-ink px-3 py-2 text-sm font-medium text-white">+ 添加食品</Link>
        </div>
        <p className="mt-2 text-sm leading-6 text-slate-600">把快过期的食物排在前面，先吃它们。</p>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
          <div className="rounded-xl bg-cream p-2"><p className="text-slate-500">总食品</p><p className="text-lg font-semibold">{totalItems}</p></div>
          <div className="rounded-xl bg-orange-50 p-2"><p className="text-slate-500">3天内快过期</p><p className="text-lg font-semibold">{urgentIn3Days}</p></div>
          <div className="rounded-xl bg-slate-100 p-2"><p className="text-slate-500">已过期</p><p className="text-lg font-semibold">{expiredCount}</p></div>
        </div>
      </section>

      <section className="mt-5 space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base font-semibold">食品倒计时列表</h2>
          <select value={sortType} onChange={(e) => { setSortType(e.target.value as SortType); setPage(1); }} className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700">
            <option value="soonest">最快过期优先</option><option value="latest">最晚过期优先</option>
          </select>
        </div>

        {pagedFoods.map((item) => <CountdownCard key={item.id} item={item} />)}

        <div className="flex items-center justify-between rounded-xl bg-white px-3 py-2 text-sm shadow-sm ring-1 ring-black/5">
          <button onClick={() => setPage((prev) => Math.max(1, prev - 1))} disabled={currentPage === 1} className="rounded-md px-3 py-1 text-slate-700 disabled:cursor-not-allowed disabled:text-slate-300">上一页</button>
          <span>第 {currentPage} / {totalPages} 页</span>
          <button onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="rounded-md px-3 py-1 text-slate-700 disabled:cursor-not-allowed disabled:text-slate-300">下一页</button>
        </div>
      </section>
    </main>
  );
}
