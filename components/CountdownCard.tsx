import Link from "next/link";
import { FoodItem, getProgressPercent, getRemainingDays, getShelfLifeDays, getStatus } from "@/lib/food";

const statusStyleMap = {
  expired: "bg-slate-200 text-slate-700",
  urgent: "bg-red-100 text-red-700",
  soon: "bg-orange-100 text-orange-700",
  watch: "bg-yellow-100 text-yellow-700",
  safe: "bg-green-100 text-green-700"
};

const barStyleMap = {
  expired: "bg-slate-300",
  urgent: "bg-red-400",
  soon: "bg-orange-400",
  watch: "bg-yellow-400",
  safe: "bg-mint"
};

export default function CountdownCard({ item }: { item: FoodItem }) {
  const totalShelfLifeDays = getShelfLifeDays(item.shelfLifeValue, item.shelfLifeUnit);
  const remainingDays = getRemainingDays(item.expiryDate);
  const progressPercent = getProgressPercent(totalShelfLifeDays, remainingDays);
  const status = getStatus(remainingDays);

  return (
    <Link href={`/foods/${item.id}`} className="block">
      <article className="cursor-pointer rounded-2xl bg-white/90 p-4 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md">
        <div className="mb-2 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">{item.name}</h3>
            <p className="text-xs text-slate-500">{item.category}</p>
          </div>
          <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${statusStyleMap[status.tone]}`}>
            {status.label}
          </span>
        </div>

        <dl className="grid grid-cols-2 gap-y-1 text-sm text-slate-600">
          <div><dt className="inline">生产日期：</dt><dd className="inline">{item.productionDate}</dd></div>
          <div><dt className="inline">保质期：</dt><dd className="inline">{item.shelfLifeValue}{item.shelfLifeUnit}</dd></div>
          <div><dt className="inline">到期日期：</dt><dd className="inline">{item.expiryDate}</dd></div>
          <div><dt className="inline">剩余天数：</dt><dd className="inline">{remainingDays} 天</dd></div>
        </dl>

        <div className="mt-4">
          <div className="mb-1 flex items-center justify-between text-xs text-slate-500"><span>倒计时进度</span><span>{Math.round(progressPercent)}%</span></div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${barStyleMap[status.tone]}`} style={{ width: `${progressPercent}%` }} /></div>
        </div>
      </article>
    </Link>
  );
}
