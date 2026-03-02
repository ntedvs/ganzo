export function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.05em] uppercase">
      <span className="bg-live-red animate-live-pulse h-1.5 w-1.5 rounded-full" />
      Live
    </span>
  )
}
