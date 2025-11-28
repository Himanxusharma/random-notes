"use client"

import { History, Clock } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

interface HistoryItem {
  id: string
  timestamp: Date
  preview: string
}

interface UndoHistoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  history: HistoryItem[]
  currentIndex: number
  onRestore: (index: number) => void
}

export function UndoHistoryDialog({ open, onOpenChange, history, currentIndex, onRestore }: UndoHistoryDialogProps) {
  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`
    return `${days} day${days > 1 ? "s" : ""} ago`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-[540px] max-h-[85vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Undo History Timeline
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {history.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <History className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p className="text-sm">No history available yet</p>
            </div>
          ) : (
            <ScrollArea className="h-[50vh] sm:h-[400px] pr-4">
              <div className="relative space-y-1">
                {/* Timeline line */}
                <div className="absolute left-[19px] top-4 bottom-4 w-px bg-border" />

                {history.map((item, index) => {
                  const isCurrent = index === currentIndex
                  return (
                    <button
                      key={item.id}
                      className={`relative w-full text-left p-3 pl-12 rounded-lg transition-all hover:bg-muted/70 ${
                        isCurrent ? "bg-muted" : ""
                      }`}
                      onClick={() => onRestore(index)}
                    >
                      {/* Timeline dot */}
                      <div
                        className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-background ${
                          isCurrent
                            ? "bg-primary ring-2 ring-primary/20"
                            : "bg-muted-foreground/20 hover:bg-muted-foreground/40"
                        }`}
                      />

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{formatTimestamp(item.timestamp)}</span>
                          {isCurrent && <span className="text-xs font-medium text-primary">Current</span>}
                        </div>
                        <p className="text-sm text-foreground line-clamp-2">{item.preview || "Empty document"}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </ScrollArea>
          )}

          <div className="pt-4 border-t border-border mt-4">
            <p className="text-xs text-muted-foreground text-center">
              {history.length > 0
                ? "Click any point in history to restore that version"
                : "Start typing to build your history"}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
