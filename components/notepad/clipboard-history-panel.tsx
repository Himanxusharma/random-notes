"use client"

import { Clipboard, Copy, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { ClipboardItem } from "../notepad-app"

interface ClipboardHistoryPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  history: ClipboardItem[]
  onPaste: (text: string) => void
  onClear: () => void
}

function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${diffDays}d ago`
}

export function ClipboardHistoryPanel({ open, onOpenChange, history, onPaste, onClear }: ClipboardHistoryPanelProps) {
  const handleCopyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-[520px] h-[80vh] sm:h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clipboard className="h-4 w-4" />
            Clipboard History
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-2 py-4">
            {history.length > 0 ? (
              history.map((item) => (
                <div
                  key={item.id}
                  className="group flex items-start gap-3 rounded-lg border border-border bg-card p-4 hover:bg-accent transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground line-clamp-2 mb-1 font-mono">{item.text}</p>
                    <span className="text-xs text-muted-foreground">{formatRelativeTime(item.timestamp)}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                      onClick={() => handleCopyToClipboard(item.text)}
                      title="Copy to clipboard"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                      onClick={() => onPaste(item.text)}
                      title="Paste into document"
                    >
                      <Clipboard className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Clipboard className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p className="text-sm">No clipboard history yet</p>
                <p className="text-xs mt-1">Copy or cut text to see it here</p>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="pt-4 border-t border-border flex flex-col-reverse sm:flex-row gap-2">
          {history.length > 0 && (
            <Button
              variant="outline"
              className="flex-1 bg-transparent text-destructive hover:text-destructive"
              onClick={onClear}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear History
            </Button>
          )}
          <Button
            variant="outline"
            className={`bg-transparent ${history.length > 0 ? "flex-1" : "w-full"}`}
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
