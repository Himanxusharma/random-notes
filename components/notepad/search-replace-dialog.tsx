"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface SearchReplaceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  content: string
  onContentChange: (content: string) => void
}

export function SearchReplaceDialog({ open, onOpenChange, content, onContentChange }: SearchReplaceDialogProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [replaceTerm, setReplaceTerm] = useState("")
  const [useRegex, setUseRegex] = useState(false)
  const [caseSensitive, setCaseSensitive] = useState(false)
  const [matchCount, setMatchCount] = useState(0)
  const [currentMatch, setCurrentMatch] = useState(0)

  useEffect(() => {
    if (searchTerm) {
      try {
        const flags = caseSensitive ? "g" : "gi"
        const pattern = useRegex
          ? new RegExp(searchTerm, flags)
          : new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), flags)
        const matches = content.match(pattern)
        setMatchCount(matches ? matches.length : 0)
      } catch (e) {
        setMatchCount(0)
      }
    } else {
      setMatchCount(0)
    }
  }, [searchTerm, content, useRegex, caseSensitive])

  const handleFindNext = () => {
    if (!searchTerm) return

    try {
      const flags = caseSensitive ? "g" : "gi"
      const pattern = useRegex
        ? new RegExp(searchTerm, flags)
        : new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), flags)
      const matches = [...content.matchAll(pattern)]

      if (matches.length > 0) {
        const nextMatch = (currentMatch + 1) % matches.length
        setCurrentMatch(nextMatch)

        // Highlight the match in the textarea
        const textarea = document.querySelector("textarea")
        if (textarea && matches[nextMatch]) {
          textarea.focus()
          textarea.setSelectionRange(
            matches[nextMatch].index!,
            matches[nextMatch].index! + matches[nextMatch][0].length,
          )
          textarea.scrollIntoView({ behavior: "smooth", block: "center" })
        }
      }
    } catch (e) {
      console.error("Search error:", e)
    }
  }

  const handleReplaceAll = () => {
    if (!searchTerm) return

    try {
      const flags = caseSensitive ? "g" : "gi"
      const pattern = useRegex
        ? new RegExp(searchTerm, flags)
        : new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), flags)
      const newContent = content.replace(pattern, replaceTerm)
      onContentChange(newContent)
      setMatchCount(0)
      setCurrentMatch(0)
    } catch (e) {
      console.error("Replace error:", e)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-[480px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search & Replace
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="search">Search</Label>
              {matchCount > 0 && (
                <span className="text-xs text-muted-foreground">
                  {currentMatch + 1} of {matchCount} matches
                </span>
              )}
            </div>
            <Input
              id="search"
              placeholder="Find in document..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleFindNext()
                }
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="replace">Replace</Label>
            <Input
              id="replace"
              placeholder="Replace with..."
              value={replaceTerm}
              onChange={(e) => setReplaceTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-center gap-2">
              <Switch id="regex" checked={useRegex} onCheckedChange={setUseRegex} />
              <Label htmlFor="regex" className="text-sm cursor-pointer">
                Use Regex
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <Switch id="case" checked={caseSensitive} onCheckedChange={setCaseSensitive} />
              <Label htmlFor="case" className="text-sm cursor-pointer">
                Case Sensitive
              </Label>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button className="flex-1 bg-transparent" variant="outline" onClick={handleFindNext}>
              Find Next
            </Button>
            <Button className="flex-1" variant="default" onClick={handleReplaceAll}>
              Replace All
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
