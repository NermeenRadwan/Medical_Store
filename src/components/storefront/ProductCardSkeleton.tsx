export function ProductCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200/80 dark:border-[#213B43] bg-white dark:bg-[#112126] overflow-hidden flex flex-col animate-pulse">
      <div className="aspect-square bg-[#E8F4F1]/80 dark:bg-[#172B31]" />
      <div className="p-5 flex-1 flex flex-col gap-3">
        <div className="h-3.5 w-1/2 rounded bg-slate-200 dark:bg-[#1D353C]" />
        <div className="h-5 w-5/6 rounded bg-slate-200 dark:bg-[#1D353C]" />
        <div className="h-4 w-full rounded bg-slate-100 dark:bg-[#172B31]" />
        <div className="mt-2 grid grid-cols-2 gap-2">
          <div className="h-12 rounded-lg bg-slate-100 dark:bg-[#172B31]" />
          <div className="h-12 rounded-lg bg-slate-100 dark:bg-[#172B31]" />
        </div>
        <div className="mt-auto pt-3 flex gap-2">
          <div className="h-10 flex-1 rounded-lg bg-slate-200 dark:bg-[#1D353C]" />
          <div className="h-10 w-28 rounded-lg bg-slate-100 dark:bg-[#172B31]" />
        </div>
      </div>
    </div>
  );
}
