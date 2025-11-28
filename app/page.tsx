"use client"

import { NotepadApp } from "@/components/notepad-app"
import { ErrorBoundary } from "@/components/error-boundary"

export default function Page() {
  return (
    <ErrorBoundary>
      <NotepadApp />
    </ErrorBoundary>
  )
}
