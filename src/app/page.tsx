import { Metadata } from "next"
import Link from "next/link"
import { Footer } from "~/components/Footer"

export const metadata: Metadata = {
  title: "Stanzo — Every claim, verified live",
  description:
    "Real-time debate fact-checking. Two speakers, one microphone, every claim verified against primary sources.",
  alternates: { canonical: "/" },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Stanzo",
  url: "https://stanzo-gules.vercel.app",
  description:
    "Real-time debate fact-checking. Two speakers, one microphone, every claim verified against primary sources.",
}

const transcript = [
  {
    speaker: "Whitfield",
    time: "12:42",
    text: "We\u2019ve created over 15 million new jobs since taking office \u2014 more than any administration in a single term in American history.",
  },
  {
    speaker: "Okafor",
    time: "13:15",
    text: "That\u2019s misleading. Most of those jobs were simply recovering pandemic losses. The labor force participation rate tells a completely different story.",
  },
  {
    speaker: "Whitfield",
    time: "14:03",
    text: "And violent crime has gone down across the board. FBI data shows a 12.2 percent drop in violent crime last year alone.",
  },
]

const claims = [
  {
    verdict: "True" as const,
    badge: false,
    text: "\u201C15 million new jobs created since taking office\u201D",
    verification:
      "Bureau of Labor Statistics data confirms approximately 15.6 million nonfarm payroll jobs added from January 2021 through June 2024.",
    source: "bls.gov",
  },
  {
    verdict: "Mixed" as const,
    badge: true,
    text: "\u201CMost of those jobs were simply recovering pandemic losses\u201D",
    verification:
      "Approximately 9.4 million jobs recovered pandemic losses, but the remaining 6.2 million represent net new creation beyond pre-pandemic levels.",
    source: "fred.stlouisfed.org",
  },
  {
    verdict: "False" as const,
    badge: true,
    text: "\u201C12.2 percent drop in violent crime last year\u201D",
    verification:
      "The FBI reported a 5.7% decrease in violent crime, not 12.2%. The cited figure appears to conflate multiple reporting periods.",
    source: "fbi.gov",
  },
]

const steps = [
  {
    n: "01",
    title: "Record",
    body: "Start a debate and Stanzo captures every word from both speakers in real-time using live transcription.",
  },
  {
    n: "02",
    title: "Extract",
    body: "Claims are identified and isolated from the transcript automatically as they\u2019re spoken.",
  },
  {
    n: "03",
    title: "Verify",
    body: "Each claim is checked against primary sources and rated with a verdict instantly.",
  },
]

export default function Home() {
  return (
    <div className="overflow-y-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero */}
      <section className="flex flex-col items-center px-8 pt-28 pb-20 md:pt-36 md:pb-28">
        <h1
          className="animate-fade-in text-center text-[36px] leading-[1.1] font-medium tracking-[-0.025em] md:text-[52px]"
          style={{ animationFillMode: "backwards" }}
        >
          Every claim,
          <br />
          verified live.
        </h1>
        <p
          className="animate-fade-in mt-5 max-w-100 text-center text-[15px] leading-[1.6] text-[#777] md:mt-6 md:text-[16px]"
          style={{ animationDelay: "0.12s", animationFillMode: "backwards" }}
        >
          Real-time debate fact-checking. Two speakers, one microphone, every
          claim verified against primary sources.
        </p>
        <Link
          href="/debates/new"
          className="animate-fade-in mt-8 border border-black px-6 py-2.5 text-[11px] font-semibold tracking-[0.08em] uppercase transition-colors duration-200 hover:bg-black hover:text-white md:mt-10"
          style={{ animationDelay: "0.24s", animationFillMode: "backwards" }}
        >
          Get started
        </Link>
      </section>

      {/* Product demo */}
      <section className="px-4 pb-24 md:px-8 md:pb-32">
        <div
          className="animate-fade-in mx-auto max-w-240"
          style={{ animationDelay: "0.4s", animationFillMode: "backwards" }}
        >
          <div className="mb-5 text-center">
            <span className="text-[11px] font-semibold tracking-[0.08em] text-[#aaa] uppercase">
              See it in action
            </span>
          </div>

          <div className="border border-[#E5E5E5]">
            {/* Demo bar */}
            <div className="flex items-center justify-between border-b border-[#E5E5E5] px-6 py-3">
              <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.05em] uppercase">
                <span className="bg-live-red animate-live-pulse h-1.5 w-1.5 rounded-full" />
                Live
              </span>
              <span className="text-[13px] font-medium">
                Whitfield vs Okafor
              </span>
              <span className="text-[12px] text-[#999] tabular-nums">
                14:03
              </span>
            </div>

            {/* Two-column mock */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px]">
              {/* Transcript */}
              <div className="border-b border-[#E5E5E5] lg:border-r lg:border-b-0">
                <div className="border-b border-[#F0F0F0] px-6 py-3">
                  <span className="text-[11px] font-semibold tracking-[0.08em] text-[#888] uppercase">
                    Transcript
                  </span>
                </div>
                <div className="px-6">
                  {transcript.map((entry, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-[80px_1fr] gap-10 border-b border-[#F0F0F0] py-7 last:border-b-0"
                    >
                      <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-semibold tracking-[0.08em] text-[#666] uppercase">
                          {entry.speaker}
                        </span>
                        <span className="text-[12px] text-[#999] tabular-nums">
                          {entry.time}
                        </span>
                      </div>
                      <p className="text-[17px] leading-normal text-[#111]">
                        {entry.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Claims */}
              <div>
                <div className="flex items-center border-b border-[#F0F0F0] px-6 py-3">
                  <span className="text-[11px] font-semibold tracking-[0.08em] text-[#888] uppercase">
                    Claims
                  </span>
                  <span className="ml-2 text-[11px] font-semibold text-[#ccc] tabular-nums">
                    {claims.length}
                  </span>
                </div>
                <div>
                  {claims.map((claim, i) => (
                    <div
                      key={i}
                      className="border-b border-[#F0F0F0] px-6 py-5 last:border-b-0"
                    >
                      <div className="mb-2">
                        {claim.badge ? (
                          <span className="inline-block border border-black px-1.5 py-px text-[10px] font-bold uppercase">
                            {claim.verdict}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold tracking-[0.08em] text-[#999] uppercase">
                            {claim.verdict}
                          </span>
                        )}
                      </div>
                      <p className="text-[13px] leading-normal text-[#444]">
                        {claim.text}
                      </p>
                      <div className="mt-4 border-l border-[#E5E5E5] pl-4">
                        <div className="mb-1.5 flex items-baseline gap-2">
                          <span className="text-[10px] font-bold tracking-[0.08em] text-[#999] uppercase">
                            Verification
                          </span>
                          <span className="text-[12px] font-semibold text-[#111]">
                            {claim.verdict}
                          </span>
                        </div>
                        <p className="text-[13px] leading-normal text-[#555]">
                          {claim.verification}
                        </p>
                        <p className="mt-3 text-[10px] text-[#aaa] transition-colors duration-200">
                          {claim.source}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-[#E5E5E5] px-8 py-20 md:py-24">
        <div className="mx-auto max-w-240">
          <h2 className="text-[11px] font-semibold tracking-[0.08em] text-[#888] uppercase">
            How it works
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-10 md:mt-12 md:grid-cols-3 md:gap-16">
            {steps.map((step) => (
              <div key={step.n}>
                <span className="text-[11px] font-semibold tracking-[0.08em] text-[#ccc] tabular-nums">
                  {step.n}
                </span>
                <h3 className="mt-3 text-[18px] font-medium">{step.title}</h3>
                <p className="mt-2 text-[13px] leading-[1.6] text-[#777]">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="flex flex-col items-center border-t border-[#E5E5E5] px-8 py-20 md:py-24">
        <h2 className="text-center text-[28px] leading-[1.2] font-medium tracking-[-0.015em] md:text-[36px]">
          Fact-check your next debate.
        </h2>
        <Link
          href="/debates/new"
          className="mt-8 border border-black px-6 py-2.5 text-[11px] font-semibold tracking-[0.08em] uppercase transition-colors duration-200 hover:bg-black hover:text-white"
        >
          Get started
        </Link>
      </section>

      <Footer />
    </div>
  )
}
