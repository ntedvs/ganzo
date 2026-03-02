import Link from "next/link"
import { Footer } from "~/components/Footer"

export default function NotFound() {
  return (
    <div className="grid grid-rows-[1fr_auto] overflow-hidden">
      <div className="flex items-center justify-center">
        <div className="flex max-w-[400px] flex-col gap-3">
          <span className="text-[11px] font-semibold tracking-[0.08em] text-[#ccc] uppercase">
            404
          </span>
          <p className="text-[18px] leading-normal text-[#111]">
            Page not found.
          </p>
          <Link
            href="/"
            className="text-[11px] font-semibold tracking-[0.08em] text-[#888] uppercase transition-colors duration-200 hover:text-black"
          >
            Go home
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}
