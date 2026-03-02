export function Footer() {
  return (
    <footer className="flex items-center border-t border-[#F0F0F0] px-8 py-3">
      <span className="text-[11px] font-semibold tracking-[0.08em] text-[#888] uppercase">
        © {new Date().getFullYear()} Stanzo
      </span>
    </footer>
  )
}
