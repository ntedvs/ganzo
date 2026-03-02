import { Metadata } from "next"

export const metadata: Metadata = {
  title: "New Debate",
  description: "Start a new fact-checked debate.",
  robots: { index: false },
}

export default function NewDebateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
