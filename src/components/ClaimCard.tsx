import { Doc } from "../../convex/_generated/dataModel"

const STATUS_LABELS: Record<Doc<"claims">["status"], string> = {
  pending: "Pending",
  checking: "Checking",
  true: "True",
  false: "False",
  mixed: "Mixed",
  unverifiable: "Unverifiable",
}

const VERDICT_STATUSES = new Set(["true", "false", "mixed"])

function parseHostname(url: string): string | null {
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return null
  }
}

export function ClaimCard({ claim }: { claim: Doc<"claims"> }) {
  const label = STATUS_LABELS[claim.status] ?? "Pending"
  const hasVerdictBadge = VERDICT_STATUSES.has(claim.status)
  const isProcessing = claim.status === "pending" || claim.status === "checking"

  return (
    <div className="border-b border-[#F0F0F0] px-8 py-5">
      <div className="mb-2">
        {hasVerdictBadge ? (
          <span className="inline-block border border-black px-1.5 py-px text-[10px] font-bold uppercase">
            {label}
          </span>
        ) : (
          <span
            className={`text-[10px] font-bold tracking-[0.08em] uppercase ${isProcessing ? "text-[#ccc]" : "text-[#999]"}`}
          >
            {label}
          </span>
        )}
      </div>

      <p className="text-[13px] leading-normal text-[#444]">
        {claim.claimText}
      </p>

      {claim.verdict && (
        <div className="mt-4 border-l border-[#E5E5E5] pl-4">
          <div className="mb-1.5 flex items-baseline gap-2">
            <span className="text-[10px] font-bold tracking-[0.08em] text-[#999] uppercase">
              Verification
            </span>
            <span className="text-[12px] font-semibold text-[#111]">
              {label}
            </span>
          </div>
          <p className="text-[13px] leading-normal text-[#555]">
            {claim.verdict}
          </p>
          {claim.correction && (
            <p className="mt-2 text-[13px] leading-normal text-[#555]">
              {claim.correction}
            </p>
          )}
          {claim.sources && claim.sources.length > 0 && (
            <SourcesList urls={claim.sources} />
          )}
        </div>
      )}
    </div>
  )
}

function SourcesList({ urls }: { urls: string[] }) {
  const parsed = urls
    .map((url) => ({ url, hostname: parseHostname(url) }))
    .filter((s): s is { url: string; hostname: string } => s.hostname !== null)

  if (parsed.length === 0) return null

  return (
    <p className="mt-3 text-[10px] text-[#aaa]">
      {parsed.map(({ url, hostname }, i) => (
        <span key={url}>
          {i > 0 && ", "}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-200 hover:text-black"
          >
            {hostname}
          </a>
        </span>
      ))}
    </p>
  )
}
